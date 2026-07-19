import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Iterable, List, Optional

import requests

from ..config import XQUIK_API_KEY, XQUIK_BASE_URL, XQUIK_SOCIAL_QUERIES

logger = logging.getLogger(__name__)

DEFAULT_QUERIES = ["agent skill", "SKILL.md", "Claude skill", "MCP server"]
MAX_LIMIT_PER_QUERY = 25


def _configured_queries(queries: Optional[Iterable[str]] = None) -> List[str]:
    raw_queries = list(queries) if queries is not None else []
    if not raw_queries and XQUIK_SOCIAL_QUERIES:
        raw_queries = XQUIK_SOCIAL_QUERIES.split(",")
    if not raw_queries:
        raw_queries = DEFAULT_QUERIES

    seen = set()
    result = []
    for query in raw_queries:
        value = " ".join(str(query).split())
        if value and value.lower() not in seen:
            result.append(value)
            seen.add(value.lower())
    return result[:8]


def _clean(value: Any) -> str:
    return " ".join(str(value or "").replace("|", "\\|").split())


def _tweet_url(tweet: Dict[str, Any]) -> str:
    author = tweet.get("author") if isinstance(tweet.get("author"), dict) else {}
    username = _clean(author.get("username"))
    tweet_id = _clean(tweet.get("id"))
    if not username or not tweet_id:
        return ""
    return f"https://x.com/{username}/status/{tweet_id}"


def _engagement(tweet: Dict[str, Any]) -> Dict[str, int]:
    return {
        "likes": int(tweet.get("likeCount") or 0),
        "reposts": int(tweet.get("retweetCount") or 0),
        "replies": int(tweet.get("replyCount") or 0),
        "quotes": int(tweet.get("quoteCount") or 0),
    }


def _normalize_signal(query: str, tweet: Dict[str, Any]) -> Dict[str, Any]:
    author = tweet.get("author") if isinstance(tweet.get("author"), dict) else {}
    return {
        "query": query,
        "id": _clean(tweet.get("id")),
        "url": _tweet_url(tweet),
        "text": _clean(tweet.get("text")),
        "created_at": _clean(tweet.get("createdAt")),
        "author": {
            "username": _clean(author.get("username")),
            "name": _clean(author.get("name")),
            "verified": bool(author.get("verified")),
        },
        "engagement": _engagement(tweet),
    }


def fetch_xquik_social_signals(
    queries: Optional[Iterable[str]] = None,
    days: int = 30,
    limit_per_query: int = 10,
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
) -> Dict[str, Any]:
    key = (api_key if api_key is not None else XQUIK_API_KEY) or ""
    normalized_queries = _configured_queries(queries)
    if not key.strip():
        return {
            "enabled": False,
            "source": "xquik",
            "queries": normalized_queries,
            "signals": [],
            "message": "Set XQUIK_API_KEY to collect public X discussion signals.",
        }

    search_url = f"{(base_url or XQUIK_BASE_URL).rstrip('/')}/x/tweets/search"
    since_time = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat().replace("+00:00", "Z")
    safe_limit = max(1, min(int(limit_per_query), MAX_LIMIT_PER_QUERY))
    signals = []
    errors = []

    for query in normalized_queries:
        try:
            response = requests.get(
                search_url,
                headers={"x-api-key": key.strip()},
                params={
                    "q": query,
                    "queryType": "Latest",
                    "sinceTime": since_time,
                    "limit": safe_limit,
                },
                timeout=20,
            )
            response.raise_for_status()
            payload = response.json()
        except (requests.RequestException, ValueError):
            logger.warning("Xquik social signal query failed for %s", query)
            errors.append({"query": query, "error": "request_failed"})
            continue

        tweets = payload.get("tweets", []) if isinstance(payload, dict) else []
        if not isinstance(tweets, list):
            errors.append({"query": query, "error": "unexpected_response"})
            continue
        for tweet in tweets:
            if isinstance(tweet, dict):
                signal = _normalize_signal(query, tweet)
                if signal["url"] and signal["text"]:
                    signals.append(signal)

    return {
        "enabled": True,
        "source": "xquik",
        "queries": normalized_queries,
        "signals": signals,
        "errors": errors,
        "message": "Public X signals are anecdotal and should be interpreted with source context.",
    }
