#!/usr/bin/env python3
"""Download all target MU SEC filings and convert to markdown."""
import json, urllib.request, time, os, re, subprocess

headers = {"User-Agent": "OpenClaw hoard bot (poomk@example.com)", "Accept-Encoding": "gzip"}

OUT_DIR = "/home/poomk/.openclaw/workspace/hoard_mu"
CIK = "723125"

def fetch_json(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
        if r.headers.get('Content-Encoding') == 'gzip':
            import gzip
            data = gzip.decompress(data)
        return json.loads(data)

def fetch_bytes(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
        if r.headers.get('Content-Encoding') == 'gzip':
            import gzip
            data = gzip.decompress(data)
        return data

# 10-K and 10-Q filings (from earlier index)
ten_k_q = [
    {"form": "10-Q", "filingDate": "2025-12-18", "accessionNumber": "0000723125-25-000046", "primaryDocument": "mu-20251127.htm"},
    {"form": "10-Q", "filingDate": "2025-06-26", "accessionNumber": "0000723125-25-000019", "primaryDocument": "mu-20250529.htm"},
    {"form": "10-Q", "filingDate": "2025-03-21", "accessionNumber": "0000723125-25-000006", "primaryDocument": "mu-20250227.htm"},
    {"form": "10-Q", "filingDate": "2024-12-19", "accessionNumber": "0000723125-24-000046", "primaryDocument": "mu-20241128.htm"},
    {"form": "10-K", "filingDate": "2024-10-04", "accessionNumber": "0000723125-24-000041", "primaryDocument": "mu-20240829.htm"},
    {"form": "10-Q", "filingDate": "2024-06-27", "accessionNumber": "0000723125-24-000023", "primaryDocument": "mu-20240530.htm"},
    {"form": "10-Q", "filingDate": "2024-03-21", "accessionNumber": "0000723125-24-000007", "primaryDocument": "mu-20240229.htm"},
    {"form": "10-Q", "filingDate": "2023-12-21", "accessionNumber": "0000723125-23-000071", "primaryDocument": "mu-20231130.htm"},
    {"form": "10-K", "filingDate": "2023-10-06", "accessionNumber": "0000723125-23-000067", "primaryDocument": "mu-20230831.htm"},
    {"form": "10-Q", "filingDate": "2023-06-29", "accessionNumber": "0000723125-23-000038", "primaryDocument": "mu-20230601.htm"},
    {"form": "10-Q", "filingDate": "2023-03-29", "accessionNumber": "0000723125-23-000018", "primaryDocument": "mu-20230302.htm"},
    {"form": "10-Q", "filingDate": "2022-12-22", "accessionNumber": "0000723125-22-000072", "primaryDocument": "mu-20221201.htm"},
    {"form": "10-K", "filingDate": "2022-10-07", "accessionNumber": "0000723125-22-000065", "primaryDocument": "mu-20220901.htm"},
    {"form": "10-Q", "filingDate": "2022-07-01", "accessionNumber": "0000723125-22-000056", "primaryDocument": "mu-20220602.htm"},
    {"form": "10-Q", "filingDate": "2022-03-30", "accessionNumber": "0000723125-22-000036", "primaryDocument": "mu-20220303.htm"},
    {"form": "10-Q", "filingDate": "2022-01-06", "accessionNumber": "0000723125-22-000012", "primaryDocument": "mu-20211202.htm"},
    {"form": "10-K", "filingDate": "2021-10-08", "accessionNumber": "0000723125-21-000086", "primaryDocument": "mu-20210902.htm"},
    {"form": "10-Q", "filingDate": "2021-07-01", "accessionNumber": "0000723125-21-000067", "primaryDocument": "mu-20210603.htm"},
    {"form": "10-Q", "filingDate": "2021-04-01", "accessionNumber": "0000723125-21-000049", "primaryDocument": "mu-20210304.htm"},
    {"form": "10-Q", "filingDate": "2021-01-08", "accessionNumber": "0000723125-21-000028", "primaryDocument": "mu-20201203.htm"},
    {"form": "10-K", "filingDate": "2020-10-19", "accessionNumber": "0000723125-20-000097", "primaryDocument": "mu-20200903.htm"},
    {"form": "10-Q", "filingDate": "2020-06-29", "accessionNumber": "0000723125-20-000074", "primaryDocument": "mu-20200528.htm"},
    {"form": "10-Q", "filingDate": "2020-03-26", "accessionNumber": "0000723125-20-000053", "primaryDocument": "mu-20200227.htm"},
]

# 8-K Exhibit 99.1 filings (from EFTS search)
eight_k_ex99 = [
    {"form": "8-K", "filingDate": "2025-12-17", "accessionNumber": "0000723125-25-000044", "filename": "a2026q1ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2025-09-23", "accessionNumber": "0000723125-25-000024", "filename": "a2025q4ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2025-06-25", "accessionNumber": "0000723125-25-000019", "filename": "a2025q3ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2025-03-20", "accessionNumber": "0000723125-25-000006", "filename": "a2025q2ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2024-12-18", "accessionNumber": "0000723125-24-000046", "filename": "a2025q1ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2024-09-25", "accessionNumber": "0000723125-24-000023", "filename": "a2024q4ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2024-06-26", "accessionNumber": "0000723125-24-000016", "filename": "a2024q3ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2024-03-20", "accessionNumber": "0000723125-24-000004", "filename": "a2024q2ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2023-12-20", "accessionNumber": "0000723125-23-000071", "filename": "a2024q1ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2023-09-27", "accessionNumber": "0000723125-23-000051", "filename": "a2023q4ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2023-06-28", "accessionNumber": "0000723125-23-000038", "filename": "a2023q3ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2023-03-28", "accessionNumber": "0000723125-23-000018", "filename": "a2023q2ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2022-12-21", "accessionNumber": "0000723125-22-000070", "filename": "a2023q1ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2022-09-29", "accessionNumber": "0000723125-22-000044", "filename": "a2022q4ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2022-06-30", "accessionNumber": "0000723125-22-000034", "filename": "a2022q3ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2022-03-29", "accessionNumber": "0000723125-22-000012", "filename": "a2022q2ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2021-12-20", "accessionNumber": "0000723125-21-000086", "filename": "a2022q1ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2021-09-28", "accessionNumber": "0000723125-21-000060", "filename": "a2021q4ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2021-06-30", "accessionNumber": "0000723125-21-000049", "filename": "a2021q3ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2021-03-31", "accessionNumber": "0000723125-21-000028", "filename": "a2021q2ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2021-01-07", "accessionNumber": "0000723125-21-000009", "filename": "a2021q1ex991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2020-09-29", "accessionNumber": "0000723125-20-000079", "filename": "a2020q4exhibit991-pres.htm"},
    {"form": "8-K", "filingDate": "2020-06-29", "accessionNumber": "0000723125-20-000063", "filename": "a2020q3exhibit991-pres.htm"},
    {"form": "8-K", "filingDate": "2020-03-25", "accessionNumber": "0000723125-20-000030", "filename": "a2020q2exhibit991-pres.htm"},
]

# Also add the non-earnings 8-K ex99.1 filings
extra_8k = [
    {"form": "8-K", "filingDate": "2022-01-10", "accessionNumber": "0001104659-22-002742", "filename": "tm222248d1_ex99-1.htm"},
    {"form": "8-K", "filingDate": "2021-08-02", "accessionNumber": "0000723125-21-000056", "filename": "exhibit991-pressreleaseq42.htm"},
    {"form": "8-K", "filingDate": "2021-03-16", "accessionNumber": "0000723125-21-000024", "filename": "exhibit991-pressreleaseq32.htm"},
    {"form": "8-K", "filingDate": "2021-03-03", "accessionNumber": "0000723125-21-000021", "filename": "exhibit991-pressreleaseq22.htm"},
    {"form": "8-K", "filingDate": "2021-02-16", "accessionNumber": "0000723125-21-000018", "filename": "exhibit991.htm"},
    {"form": "8-K", "filingDate": "2020-12-01", "accessionNumber": "0000723125-20-000094", "filename": "exhibit991-pressrelease.htm"},
    {"form": "8-K", "filingDate": "2020-08-04", "accessionNumber": "0001104659-20-090285", "filename": "tm2026510d1_ex99-1.htm"},
    {"form": "8-K", "filingDate": "2020-05-22", "accessionNumber": "0000723125-20-000050", "filename": "mbuinvestorupdateexhibit.htm"},
    {"form": "8-K", "filingDate": "2020-05-12", "accessionNumber": "0000723125-20-000041", "filename": "investorupdateq320final.htm"},
]

# Combine all 8-K ex99.1
all_8k = eight_k_ex99 + extra_8k

# Remove duplicates (some 8-K ex99.1 overlap with 10-K/10-Q filings)
# We want ~20 total files. Let's prioritize:
# 5 10-Ks (2020-2024) + ~10 10-Qs (most recent) + ~5 8-K earnings releases

# Select target files
targets = []

# All 10-Ks (2020-2024) - 5 files
for f in ten_k_q:
    if f["form"] == "10-K":
        targets.append(f)

# 10-Qs - pick most recent ones to fill up to ~15 total
ten_qs = [f for f in ten_k_q if f["form"] == "10-Q"]
# Sort by date descending
ten_qs.sort(key=lambda x: x["filingDate"], reverse=True)
# Take most recent 10-Qs
for f in ten_qs[:8]:
    targets.append(f)

# 8-K earnings releases - most recent ones
eight_k_earnings = [f for f in eight_k_ex99 if "pressrelease" in f["filename"].lower() or "exhibit991" in f["filename"].lower()]
eight_k_earnings.sort(key=lambda x: x["filingDate"], reverse=True)
# Take most recent earnings releases
for f in eight_k_earnings[:7]:
    targets.append(f)

print(f"Total targets: {len(targets)}")
for t in targets:
    print(f"  {t['form']:5s} {t['filingDate']} {t.get('primaryDocument', t.get('filename', ''))}")

# Now download and convert each file
results = []
for i, t in enumerate(targets):
    acc = t["accessionNumber"]
    acc_no_dashes = acc.replace("-", "")
    
    if t["form"] in ["10-K", "10-Q"]:
        doc = t["primaryDocument"]
    else:
        doc = t["filename"]
    
    url = f"https://www.sec.gov/Archives/edgar/data/{CIK}/{acc_no_dashes}/{doc}"
    
    # Create output filename
    date_str = t["filingDate"]
    form = t["form"].lower().replace("-", "")
    out_base = f"MU_{form}_{date_str}"
    out_html = os.path.join(OUT_DIR, f"{out_base}.html")
    out_md = os.path.join(OUT_DIR, f"{out_base}.md")
    
    print(f"\n[{i+1}/{len(targets)}] Downloading {t['form']} {date_str}...")
    print(f"  URL: {url}")
    
    try:
        data = fetch_bytes(url)
        with open(out_html, "wb") as fp:
            fp.write(data)
        print(f"  Downloaded {len(data)} bytes")
        
        # Convert to markdown using html2text
        import html2text
        h = html2text.HTML2Text()
        h.ignore_links = False
        h.ignore_images = True
        h.body_width = 0
        md_content = h.handle(data.decode('utf-8', errors='replace'))
        
        with open(out_md, "w") as fp:
            fp.write(md_content)
        
        # Add YAML front matter
        with open(out_md, "r") as fp:
            md_content = fp.read()
        
        yaml_front = f"""---
ticker: MU
company: Micron Technology Inc
cik: 723125
form_type: {t['form']}
filing_date: {date_str}
accession_number: {acc}
source_url: {url}
---

"""
        
        with open(out_md, "w") as fp:
            fp.write(yaml_front + md_content)
        
        # Delete HTML original
        os.remove(out_html)
        
        file_size = os.path.getsize(out_md)
        print(f"  Converted to MD: {file_size} bytes")
        results.append({"form": t["form"], "date": date_str, "file": out_md, "size": file_size})
        
    except Exception as e:
        print(f"  Error: {e}")
    
    time.sleep(0.2)

print(f"\n\nCompleted! {len(results)} files converted to markdown.")
for r in results:
    print(f"  {r['form']:5s} {r['date']} {r['size']:>8} bytes  {r['file']}")