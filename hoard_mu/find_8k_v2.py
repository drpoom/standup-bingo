#!/usr/bin/env python3
"""Find MU 8-K filings with Exhibit 99.1 using EDGAR EFTS search API."""
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

# Use EFTS search with CIK filter
url = "https://efts.sec.gov/LATEST/search-index?q=%22ex-99.1%22&dateRange=custom&startdt=2020-01-01&enddt=2025-12-31&forms=8-K&entity=0000723125&from=0&size=40"
try:
    result = fetch_json(url)
    hits = result.get("hits", {}).get("hits", [])
    print(f"Found {len(hits)} hits")
    for h in hits:
        src = h["_source"]
        print(f"  {src.get('adsh','')} | {src.get('file_date','')} | {src.get('file_type','')} | {h['_id'].split(':')[1] if ':' in h['_id'] else ''}")
except Exception as e:
    print(f"Error: {e}")

# Try alternative: use the filing index for each 8-K accession number
# The index.json URL format might need adjustment
print("\n--- Trying direct filing index approach ---")

# Load the submissions data
submissions = fetch_json("https://data.sec.gov/submissions/CIK0000723125.json")
recent = submissions["filings"]["recent"]

# Find 8-K filings from 2020-2025
eight_k_accs = []
for i in range(len(recent["accessionNumber"])):
    form = recent["form"][i]
    date = recent["filingDate"][i]
    year = int(date[:4])
    if form == "8-K" and 2020 <= year <= 2025:
        eight_k_accs.append({
            "acc": recent["accessionNumber"][i],
            "date": date,
            "primary": recent["primaryDocument"][i]
        })

print(f"Total 8-K filings: {len(eight_k_accs)}")

# For each 8-K, try to get the filing directory listing
# Use the correct URL format: https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=723125&type=8-K&dateb=&owner=include&count=40&search_text=&action=getcompany
# Or use the filing index with correct path

# Let's try fetching the index for a few 8-Ks with the correct URL
# The index.json should be at: https://www.sec.gov/Archives/edgar/data/723125/{acc-no-dashes}/index.json
# But some 8-Ks are filed by third parties (like 0001104659 which is Innisfree M&A)

# Let's try a different approach - use the EFTS search with proper entity filter
url2 = "https://efts.sec.gov/LATEST/search-index?q=%22ex-99.1%22&dateRange=custom&startdt=2020-01-01&enddt=2025-12-31&forms=8-K&entity=723125&from=0&size=40"
try:
    result2 = fetch_json(url2)
    hits2 = result2.get("hits", {}).get("hits", [])
    print(f"\nEFTS search with entity=723125: {len(hits2)} hits")
    for h in hits2[:20]:
        src = h["_source"]
        ciks = src.get("ciks", [])
        if "0000723125" in ciks:
            filename = h["_id"].split(":")[1] if ":" in h["_id"] else ""
            print(f"  {src.get('adsh','')} | {src.get('file_date','')} | {filename}")
except Exception as e:
    print(f"Error: {e}")