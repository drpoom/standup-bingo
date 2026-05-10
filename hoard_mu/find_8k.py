#!/usr/bin/env python3
"""Find MU 8-K filings with Exhibit 99.1 using EDGAR full-text search."""
import json, urllib.request, time

headers = {"User-Agent": "OpenClaw hoard bot (poomk@example.com)", "Accept-Encoding": "gzip"}

def fetch_json(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
        if r.headers.get('Content-Encoding') == 'gzip':
            import gzip
            data = gzip.decompress(data)
        return json.loads(data)

# Use EDGAR full-text search to find 8-K Exhibit 99.1 filings
# Search for Micron 8-K filings with exhibit 99.1
url = "https://efts.sec.gov/LATEST/search-index?q=%22ex-99.1%22&entity=723125&forms=8-K&dateRange=custom&startdt=2020-01-01&enddt=2025-12-31&from=0&size=50"
try:
    result = fetch_json(url)
    print(json.dumps(result, indent=2)[:3000])
except Exception as e:
    print(f"Search API error: {e}")

# Alternative: try the newer EFTS search endpoint
url2 = "https://efts.sec.gov/LATEST/search-index?q=%22exhibit+99.1%22&entity=723125&forms=8-K&dateRange=custom&startdt=2020-01-01&enddt=2025-12-31&from=0&size=50"
try:
    result2 = fetch_json(url2)
    print("Search 2:", json.dumps(result2, indent=2)[:3000])
except Exception as e:
    print(f"Search API 2 error: {e}")