import requests
import logging
from ..config import GITHUB_TOKEN

logger = logging.getLogger(__name__)

def search_github_mcp(query="mcp-server", page=1):
    """
    Search GitHub for repositories with MCP related topics or files.
    """
    headers = {}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    
    # Search for repos with 'mcp-server' topic or 'SKILL.md' in filename
    url = f"https://api.github.com/search/repositories?q={query}&page={page}&per_page=100"
    
    try:
        r = requests.get(url, headers=headers, timeout=15)
        r.raise_for_status()
        data = r.json()
        
        results = []
        for item in data.get("items", []):
            results.append({
                "id": f"gh-{item['id']}",
                "name": item["name"],
                "author": item["owner"]["login"],
                "stars": item["stargazers_count"],
                "url": item["html_url"],
                "description": item["description"],
                "updated_at": item["updated_at"],
                "source": "github"
            })
        return results
    except Exception as e:
        logger.error(f"GitHub search failed: {e}")
        return []

def discover_by_file(filename="SKILL.md", page=1):
    """
    Search for repositories containing specific characteristic files.
    """
    headers = {}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
        
    url = f"https://api.github.com/search/code?q=filename:{filename}&page={page}&per_page=100"
    
    try:
        r = requests.get(url, headers=headers, timeout=15)
        r.raise_for_status()
        data = r.json()
        
        results = []
        # Code search returns files, we need to map back to repos
        repo_ids = set()
        for item in data.get("items", []):
            repo = item["repository"]
            if repo["id"] not in repo_ids:
                results.append({
                    "id": f"gh-{repo['id']}",
                    "name": repo["name"],
                    "author": repo["owner"]["login"],
                    "url": repo["html_url"],
                    "source": "github_code_search"
                })
                repo_ids.add(repo["id"])
        return results
    except Exception as e:
        logger.error(f"GitHub code search failed: {e}")
        return []
