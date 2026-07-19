import unittest
from unittest.mock import patch

from app.services.xquik_social import fetch_xquik_social_signals


class FakeResponse:
    def raise_for_status(self):
        return None

    def json(self):
        return {
            "tweets": [
                {
                    "id": "12345",
                    "text": "New SKILL.md repository for agent research.",
                    "createdAt": "2026-06-01T10:00:00Z",
                    "likeCount": 4,
                    "retweetCount": 2,
                    "replyCount": 1,
                    "quoteCount": 0,
                    "author": {
                        "username": "builder",
                        "name": "Builder",
                        "verified": True,
                    },
                }
            ]
        }


class InvalidJsonResponse:
    def raise_for_status(self):
        return None

    def json(self):
        raise ValueError("invalid JSON")


class XquikSocialSignalsTest(unittest.TestCase):
    def test_returns_disabled_without_api_key(self):
        result = fetch_xquik_social_signals(queries=["agent skill"], api_key="")

        self.assertFalse(result["enabled"])
        self.assertEqual(result["source"], "xquik")
        self.assertEqual(result["signals"], [])

    def test_normalizes_social_signals_without_key_disclosure(self):
        calls = []

        def fake_get(url, headers, params, timeout):
            calls.append({"url": url, "headers": headers, "params": params, "timeout": timeout})
            return FakeResponse()

        with patch("app.services.xquik_social.requests.get", fake_get):
            result = fetch_xquik_social_signals(
                queries=["SKILL.md"],
                api_key="fake-key",
                base_url="https://xquik.example/api/v1",
            )

        self.assertTrue(result["enabled"])
        self.assertEqual(result["signals"][0]["url"], "https://x.com/builder/status/12345")
        self.assertEqual(result["signals"][0]["author"]["username"], "builder")
        self.assertEqual(result["signals"][0]["engagement"]["likes"], 4)
        self.assertNotIn("fake-key", str(result))
        self.assertEqual(calls[0]["headers"]["x-api-key"], "fake-key")
        self.assertEqual(calls[0]["params"]["queryType"], "Latest")

    @patch(
        "app.services.xquik_social.requests.get",
        return_value=InvalidJsonResponse(),
    )
    def test_reports_invalid_json_without_failing_the_route(self, _mock_get):
        result = fetch_xquik_social_signals(
            queries=["agent skill"],
            api_key="fake-key",
        )

        self.assertTrue(result["enabled"])
        self.assertEqual(result["signals"], [])
        self.assertEqual(
            result["errors"],
            [{"query": "agent skill", "error": "request_failed"}],
        )


if __name__ == "__main__":
    unittest.main()
