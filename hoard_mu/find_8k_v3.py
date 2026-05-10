#!/usr/bin/env python3
"""Find MU 8-K Exhibit 99.1 filings by checking each 8-K's directory listing."""
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
            "primary": recent["primaryDocument"][i]
        })

print(f"Total 8-K filings to check: {len(eight_k_accs)}")

# For each 8-K, try to find Exhibit 99.1
# Use the filing index URL
ex99_results = []
for f in eight_k_accs:
    acc = f["acc"]
    acc_no_dashes = acc.replace("-", "")
    
    # Try the filing directory index
    idx_url = f"https://www.sec.gov/Archives/edgar/data/723125/{acc_no_dashes}/index.json"
    try:
        idx = fetch_json(idx_url)
        items = idx.get("directory", {}).get("item", [])
        for item in items:
            name = item["name"].lower()
            # Look for exhibit 99.1
            if ("ex-99" in name or "ex99" in name or "exhibit99" in name) and "99.1" in name:
                ex99_results.append({
                    "form": "8-K",
                    "filingDate": f["date"],
                    "accessionNumber": acc,
                    "url": f"https://www.sec.gov/Archives/edgar/data/723125/{acc_no_dashes}/{item['name']}",
                    "filename": item["name"],
                    "type": "exhibit99.1"
                })
                break
        time.sleep(0.15)
    except Exception as e:
        # Some 8-Ks are filed by third parties, try alternate CIK paths
        # The accession number prefix tells us the filer CIK
        pass

print(f"\nFound {len(ex99_results)} 8-K filings with Exhibit 99.1")
for r in ex99_results:
    print(f"  {r['filingDate']} {r['filename']}")

# Save results
with open("/home/poomk/.openclaw/workspace/hoard_mu/ex99_results.json", "w") as fp:
    json.dump(ex99_results, fp, indent=2)