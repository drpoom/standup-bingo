#!/usr/bin/env python3
"""Find MU 8-K Exhibit 99.1 using EDGAR EFTS search with proper CIK filter."""
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

# Use EFTS search with CIK filter - the entity param needs to be the CIK with leading zeros
# Try different search approaches
searches = [
    # Search for Micron 8-K with exhibit 99.1
    "https://efts.sec.gov/LATEST/search-index?q=%22micron%22+%22ex-99.1%22&forms=8-K&dateRange=custom&startdt=2020-01-01&enddt=2025-12-31&from=0&size=40",
    # Search by CIK in the ciks field
    "https://efts.sec.gov/LATEST/search-index?q=%22ex-99.1%22&forms=8-K&dateRange=custom&startdt=2020-01-01&enddt=2025-12-31&entity=0000723125&from=0&size=40",
]

for url in searches:
    try:
        result = fetch_json(url)
        hits = result.get("hits", {}).get("hits", [])
        total = result.get("hits", {}).get("total", {}).get("value", 0)
        print(f"\nURL: ...{url[-60:]}")
        print(f"Total hits: {total}")
        
        mu_hits = []
        for h in hits:
            src = h["_source"]
            ciks = src.get("ciks", [])
            if "0000723125" in ciks:
                filename = h["_id"].split(":")[1] if ":" in h["_id"] else ""
                mu_hits.append({
                    "adsh": src.get("adsh", ""),
                    "file_date": src.get("file_date", ""),
                    "filename": filename,
                })
        
        if mu_hits:
            print(f"MU matches: {len(mu_hits)}")
            for m in mu_hits:
                print(f"  {m['adsh']} | {m['file_date']} | {m['filename']}")
        else:
            print("No MU matches in this batch")
    except Exception as e:
        print(f"Error: {e}")

# Alternative: directly check 8-K filing index pages for earnings-related 8-Ks
# Micron typically files 8-K with earnings around: Mar, Jun, Sep, Dec (quarterly)
# Let's check the filing index pages for 8-Ks that have Exhibit 99.1

# Load submissions
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
            "primary": recent["primaryDocument"][i],
            "primaryDesc": recent["primaryDocDescription"][i] if "primaryDocDescription" in recent else ""
        })

# Sort by date
eight_k_accs.sort(key=lambda x: x["date"], reverse=True)

# Check each 8-K's index page for Exhibit 99.1
ex99_results = []
for f in eight_k_accs:
    acc = f["acc"]
    acc_no_dashes = acc.replace("-", "")
    
    # Try the filing index page
    idx_url = f"https://www.sec.gov/Archives/edgar/data/723125/{acc_no_dashes}/{acc}-index.htm"
    try:
        req = urllib.request.Request(idx_url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as r:
            data = r.read()
            if r.headers.get('Content-Encoding') == 'gzip':
                import gzip
                data = gzip.decompress(data)
            text = data.decode('utf-8', errors='replace')
        
        # Look for Exhibit 99.1
        import re
        # Find all document links in the index page
        ex99_pattern = re.findall(r'(ex[-_]?99\.1[^"]*\.htm)', text, re.IGNORECASE)
        if ex99_pattern:
            ex99_results.append({
                "form": "8-K",
                "filingDate": f["date"],
                "accessionNumber": acc,
                "url": f"https://www.sec.gov/Archives/edgar/data/723125/{acc_no_dashes}/{ex99_pattern[0]}",
                "filename": ex99_pattern[0],
                "type": "exhibit99.1"
            })
            print(f"  Found: {f['date']} {ex99_pattern[0]}")
        time.sleep(0.15)
    except Exception as e:
        pass  # Skip 404s silently

print(f"\nTotal 8-K Exhibit 99.1 found: {len(ex99_results)}")
for r in ex99_results:
    print(f"  {r['filingDate']} {r['filename']}")

with open("/home/poomk/.openclaw/workspace/hoard_mu/ex99_results.json", "w") as fp:
    json.dump(ex99_results, fp, indent=2)