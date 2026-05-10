#!/usr/bin/env python3
"""Fetch MU SEC filings from EDGAR and identify target documents."""
import json, urllib.request, time, os, re

BASE = "https://data.sec.gov"
CIK = "723125"
CIK_PAD = "0000723125"
OUT_DIR = "/home/poomk/.openclaw/workspace/hoard_mu"

headers = {"User-Agent": "OpenClaw hoard bot (poomk@example.com)", "Accept-Encoding": "gzip"}

def fetch_json(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
        if r.headers.get('Content-Encoding') == 'gzip':
            import gzip
            data = gzip.decompress(data)
        return json.loads(data)

# Get submissions index
print("Fetching submissions index...")
submissions = fetch_json(f"{BASE}/submissions/CIK{CIK_PAD}.json")

# Collect all filings from recent + older
recent = submissions["filings"]["recent"]
all_filings = []
for i in range(len(recent["accessionNumber"])):
    all_filings.append({
        "accessionNumber": recent["accessionNumber"][i],
        "filingDate": recent["filingDate"][i],
        "form": recent["form"][i],
        "primaryDocument": recent["primaryDocument"][i],
        "primaryDocDescription": recent["primaryDocDescription"][i],
    })

# Filter for target forms
targets = []
for f in all_filings:
    form = f["form"]
    year = int(f["filingDate"][:4])
    
    if form == "10-K" and 2020 <= year <= 2024:
        targets.append(f)
    elif form == "10-Q" and 2020 <= year <= 2025:
        targets.append(f)
    elif form == "8-K" and 2020 <= year <= 2025:
        targets.append(f)

print(f"Found {len(targets)} potential target filings (10-K, 10-Q, 8-K)")

# For 8-K, we need to check if Exhibit 99.1 exists
# First, separate 8-Ks from others
ten_k = [f for f in targets if f["form"] == "10-K"]
ten_q = [f for f in targets if f["form"] == "10-Q"]
eight_k = [f for f in targets if f["form"] == "8-K"]

print(f"10-K: {len(ten_k)}, 10-Q: {len(ten_q)}, 8-K: {len(eight_k)}")

# Sort by date
ten_k.sort(key=lambda x: x["filingDate"], reverse=True)
ten_q.sort(key=lambda x: x["filingDate"], reverse=True)
eight_k.sort(key=lambda x: x["filingDate"], reverse=True)

# For 10-K and 10-Q, we want the primary document
# For 8-K, we need Exhibit 99.1 (earnings press release)
# Let's get the filing index for 8-Ks to find Exhibit 99.1

results = []

# Process 10-K filings
for f in ten_k:
    acc = f["accessionNumber"]
    acc_no_dashes = acc.replace("-", "")
    doc = f["primaryDocument"]
    url = f"https://www.sec.gov/Archives/edgar/data/{CIK}/{acc_no_dashes}/{doc}"
    results.append({
        "form": "10-K",
        "filingDate": f["filingDate"],
        "accessionNumber": acc,
        "url": url,
        "filename": doc,
        "type": "primary"
    })

# Process 10-Q filings
for f in ten_q:
    acc = f["accessionNumber"]
    acc_no_dashes = acc.replace("-", "")
    doc = f["primaryDocument"]
    url = f"https://www.sec.gov/Archives/edgar/data/{CIK}/{acc_no_dashes}/{doc}"
    results.append({
        "form": "10-Q",
        "filingDate": f["filingDate"],
        "accessionNumber": acc,
        "url": url,
        "filename": doc,
        "type": "primary"
    })

# For 8-Ks, we need to find Exhibit 99.1
# Fetch the filing index for each 8-K
eight_k_with_ex99 = []
for f in eight_k:
    acc = f["accessionNumber"]
    acc_no_dashes = acc.replace("-", "")
    idx_url = f"{BASE}/Archives/edgar/data/{CIK}/{acc_no_dashes}/index.json"
    try:
        idx = fetch_json(idx_url)
        # Look for Exhibit 99.1
        for item in idx.get("directory", {}).get("item", []):
            name = item["name"].lower()
            if "ex" in name and "99.1" in name:
                eight_k_with_ex99.append({
                    "form": "8-K",
                    "filingDate": f["filingDate"],
                    "accessionNumber": acc,
                    "url": f"https://www.sec.gov/Archives/edgar/data/{CIK}/{acc_no_dashes}/{item['name']}",
                    "filename": item["name"],
                    "type": "exhibit99.1"
                })
                break
        time.sleep(0.1)
    except Exception as e:
        print(f"Error fetching index for {acc}: {e}")

print(f"\n8-K filings with Exhibit 99.1: {len(eight_k_with_ex99)}")

# Combine all results
all_results = results + eight_k_with_ex99
all_results.sort(key=lambda x: x["filingDate"], reverse=True)

# Save results
with open(os.path.join(OUT_DIR, "filings_index.json"), "w") as fp:
    json.dump(all_results, fp, indent=2)

print(f"\nTotal target filings: {len(all_results)}")
for r in all_results:
    print(f"  {r['form']:5s} {r['filingDate']} {r['type']:15s} {r['filename']}")