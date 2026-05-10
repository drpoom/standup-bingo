#!/usr/bin/env python3
"""Find MU 8-K Exhibit 99.1 by fetching the filing's primary document and checking for exhibit references."""
import json, urllib.request, time, re

headers = {"User-Agent": "OpenClaw hoard bot (poomk@example.com)", "Accept-Encoding": "gzip"}

def fetch_json(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
        if r.headers.get('Content-Encoding') == 'gzip':
            import gzip
            data = gzip.decompress(data)
        return json.loads(data)

def fetch_text(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
        if r.headers.get('Content-Encoding') == 'gzip':
            import gzip
            data = gzip.decompress(data)
        return data.decode('utf-8', errors='replace')

# Try the EDGAR filing index page for a specific 8-K
# Format: https://www.sec.gov/Archives/edgar/data/723125/{acc-no-dashes}/{acc-with-dashes}-index.htm
# Or try: https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=723125&type=8-K&dateb=&owner=include&count=40

# Let's try the EDGAR full-text search API with proper CIK filter
# The correct API endpoint is: https://efts.sec.gov/LATEST/search-index
# with entity parameter as CIK with leading zeros

url = "https://efts.sec.gov/LATEST/search-index?q=%22ex-99.1%22&dateRange=custom&startdt=2020-01-01&enddt=2025-12-31&forms=8-K&entity=0000723125&from=0&size=40"
try:
    result = fetch_json(url)
    hits = result.get("hits", {}).get("hits", [])
    print(f"Found {len(hits)} hits for CIK 0000723125")
    mu_hits = []
    for h in hits:
        src = h["_source"]
        ciks = src.get("ciks", [])
        if "0000723125" in ciks:
            filename = h["_id"].split(":")[1] if ":" in h["_id"] else ""
            adsh = src.get("adsh", "")
            file_date = src.get("file_date", "")
            mu_hits.append({
                "adsh": adsh,
                "file_date": file_date,
                "filename": filename,
                "file_type": src.get("file_type", ""),
            })
            print(f"  MU match: {adsh} | {file_date} | {filename}")
    print(f"\nTotal MU 8-K Exhibit 99.1: {len(mu_hits)}")
except Exception as e:
    print(f"Error: {e}")

# Also try browsing the filing index page
# Let's try one specific 8-K filing to see the structure
# Use a known MU 8-K accession number
test_acc = "0000723125-25-000046"  # A recent MU 8-K
test_acc_no_dashes = test_acc.replace("-", "")
print(f"\nTrying filing index page for {test_acc}...")
try:
    idx_url = f"https://www.sec.gov/Archives/edgar/data/723125/{test_acc_no_dashes}/{test_acc}-index.htm"
    text = fetch_text(idx_url)
    # Find exhibit 99.1 references
    ex99_matches = re.findall(r'href="([^"]*ex[^"]*99[^"]*1[^"]*)"', text, re.IGNORECASE)
    print(f"  Found {len(ex99_matches)} exhibit 99.1 links")
    for m in ex99_matches[:5]:
        print(f"    {m}")
    
    # Also look for all document links
    doc_matches = re.findall(r'href="([^"]+\.htm)"', text)
    print(f"  Total .htm links: {len(doc_matches)}")
    for m in doc_matches[:10]:
        print(f"    {m}")
except Exception as e:
    print(f"  Error: {e}")