#!/usr/bin/env python3
"""
Inject YAML frontmatter into stock filing markdown files that lack it.

Usage:
  python3 scripts/inject_frontmatter.py --batch          # Process all files missing frontmatter
  python3 scripts/inject_frontmatter.py --ticker META    # Process files for a specific ticker
  python3 scripts/inject_frontmatter.py --dry-run        # Show what would be done without modifying files
  python3 scripts/inject_frontmatter.py --update         # Update frontmatter for ALL files (re-parse)
"""

import os
import re
import sys
import csv
import yaml
import argparse
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent / "investments" / "stocks"
AUDIT_DIR = Path(__file__).parent.parent / "audit"
AUDIT_CSV = AUDIT_DIR / "frontmatter_changes.csv"

# Company name mapping
COMPANY_NAMES = {
    "AAPL": "Apple Inc.",
    "GOOGL": "Alphabet Inc.",
    "HESAI": "Hesai Group",
    "KAMART": "Kamart Corporation",
    "KBANK": "Kasikornbank Public Company Limited",
    "META": "Meta Platforms, Inc.",
    "MU": "Micron Technology, Inc.",
    "SIS": "Siam Cement Group",
    "SISB": "Siam Commercial Bank",
    "SK-Hynix": "SK Hynix Inc.",
    "Samsung": "Samsung Electronics",
    "TSM": "Taiwan Semiconductor Manufacturing Company",
    "Trip": "Trip.com Group",
    "Xiaomi": "Xiaomi Corporation",
}

# CIK mapping (for SEC filers)
CIK_MAP = {
    "AAPL": "0000320193",
    "GOOGL": "0001652044",
    "HESAI": "0001960943",
    "META": "0001326801",
    "MU": "0000723125",
    "TSM": "0001046179",
}


def parse_filename_metadata(filepath: Path) -> dict:
    """Extract metadata from filename and path."""
    name = filepath.stem
    parts = filepath.parts
    # Find ticker index in path
    ticker_idx = None
    for i, p in enumerate(parts):
        if p == "stocks" and i + 1 < len(parts):
            ticker_idx = i + 1
            break

    if ticker_idx is None:
        return {}

    ticker = parts[ticker_idx]
    # Get full subpath after ticker (e.g. "sec-filings/10-Q" or "presentations")
    subpath_parts = parts[ticker_idx + 1:-1]  # everything between ticker dir and filename
    subfolder = subpath_parts[0] if subpath_parts else ""
    subpath = "/".join(subpath_parts)

    meta = {
        "ticker": ticker,
        "company": COMPANY_NAMES.get(ticker, ticker),
    }

    if ticker in CIK_MAP:
        meta["cik"] = CIK_MAP[ticker]

    # === Subfolder-based form_type detection ===

    # earnings-presentations/
    if subfolder == "earnings-presentations":
        meta["form_type"] = "earnings-presentation"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # filings/
    if subfolder == "filings":
        meta["form_type"] = "filing"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # interim-reports/
    if subfolder == "interim-reports":
        meta["form_type"] = "interim-report"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # quarterly-reports/
    if subfolder == "quarterly-reports":
        meta["form_type"] = "quarterly-report"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # quarterly-results/
    if subfolder == "quarterly-results":
        if "Transcript" in name or "transcript" in name.lower():
            meta["form_type"] = "transcript"
        elif "Presentation" in name or "presentation" in name.lower():
            meta["form_type"] = "presentation"
        else:
            meta["form_type"] = "quarterly-result"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # 56-1/
    if subfolder == "56-1":
        meta["form_type"] = "56-1"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # presentations/
    if subfolder == "presentations":
        meta["form_type"] = "presentation"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # transcripts/
    if subfolder == "transcripts":
        meta["form_type"] = "transcript"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # FS/ (financial statements)
    if subfolder == "FS":
        meta["form_type"] = "financial-statement"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # financials/
    if subfolder == "financials":
        meta["form_type"] = "financial-statement"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # or/ (operating results)
    if subfolder == "or":
        meta["form_type"] = "annual-report"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = f"FY{m.group(1)}"
        return meta

    # 56-6/
    if subfolder == "56-6" or "56-6" in name:
        meta["form_type"] = "56-6"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # sec-filings/ subfolders
    if subfolder == "sec-filings":
        if "10-Q" in subpath or "10-Q" in name:
            meta["form_type"] = "10-Q"
        elif "10-K" in subpath or "10-K" in name:
            meta["form_type"] = "10-K"
        elif "20-F" in subpath or "20-F" in name or "20F" in name:
            meta["form_type"] = "20-F"
        elif "6-K" in subpath or "6-K" in name:
            meta["form_type"] = "6-K"
        elif "8-K" in subpath or "8-K" in name:
            meta["form_type"] = "8-K"
        else:
            meta["form_type"] = "SEC-filing"
        m = re.search(r"(\d{4})-(\d{2})-(\d{2})", name)
        if m:
            meta["filing_date"] = f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
        m2 = re.search(r"(\d{4})", name)
        if m2 and "fiscal_period" not in meta:
            meta["fiscal_period"] = m2.group(1)
        return meta

    # Kamart/ subfolders
    if subfolder == "Kamart":
        if "annual" in subpath.lower() or "or" in name.lower():
            meta["form_type"] = "annual-report"
        elif "quarterly" in subpath.lower() or "fs" in name.lower():
            meta["form_type"] = "financial-statement"
        else:
            meta["form_type"] = "report"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # === Filename-based pattern matching ===

    # Pattern: META-20240930 (quarterly/annual report)
    m = re.match(rf"^{re.escape(ticker)}-(\d{{8}})$", name)
    if m:
        date_str = m.group(1)
        year = date_str[:4]
        month = date_str[4:6]
        day = date_str[6:8]
        meta["form_type"] = "10-Q" if month in ("03", "06", "09") else "10-K"
        meta["fiscal_period"] = f"FY{year}" if month == "12" else f"Q{int(month)//3}{year}"
        meta["fiscal_year_end"] = f"{year}-{month}-{day}"
        meta["filing_date"] = f"{year}-{month}-{day}"
        return meta

    # Pattern: META-earnings-release-Q1-2026
    m = re.match(rf"^{re.escape(ticker)}-earnings-release-Q(\d)-(\d{{4}})$", name)
    if m:
        q = m.group(1)
        year = m.group(2)
        meta["form_type"] = "earnings-release"
        meta["fiscal_period"] = f"Q{q}{year}"
        meta["filing_date"] = f"{year}-01-01"
        return meta

    # Pattern: 10-K/...
    if "10-K" in name or subfolder == "10-K":
        meta["form_type"] = "10-K"
        m = re.search(r"(\d{4})-(\d{2})-(\d{2})", name)
        if m:
            meta["filing_date"] = f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
            meta["fiscal_year_end"] = f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
            meta["fiscal_period"] = f"FY{m.group(1)}"
        m2 = re.search(r"FY(\d{4})", name)
        if m2:
            meta["fiscal_period"] = f"FY{m2.group(1)}"
        return meta

    # Pattern: 10-Q/...
    if "10-Q" in name or subfolder == "10-Q":
        meta["form_type"] = "10-Q"
        m = re.search(r"(\d{4})-(\d{2})-(\d{2})", name)
        if m:
            meta["filing_date"] = f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
            meta["fiscal_period"] = f"Q{(int(m.group(2))-1)//3+1}{m.group(1)}"
        return meta

    # Pattern: 6-K/...
    if "6-K" in name or subfolder == "6-K":
        meta["form_type"] = "6-K"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # Pattern: 20-F/...
    if "20-F" in name or subfolder == "20-F":
        meta["form_type"] = "20-F"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = f"FY{m.group(1)}"
        return meta

    # Pattern: earnings/...
    if subfolder == "earnings" or "earnings" in name.lower():
        meta["form_type"] = "earnings-release"
        m = re.search(r"(\d{4})-Q(\d)", name)
        if m:
            meta["fiscal_period"] = f"Q{m.group(2)}{m.group(1)}"
        return meta

    # Pattern: earnings-releases/
    if subfolder == "earnings-releases" or "earnings-release" in name.lower():
        meta["form_type"] = "earnings-release"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # Pattern: annual-reports/...
    if "annual" in subpath.lower() or "annual" in name.lower() or "ar-" in name.lower() or "OneReport" in name:
        meta["form_type"] = "annual-report"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = f"FY{m.group(1)}"
        return meta

    # Pattern: SEC accession number files like 000072312525000012-micron-20250228
    m = re.match(r"^(\d{10})-(\w+)-(\d{8})$", name)
    if m:
        meta["accession_number"] = m.group(1)
        meta["filing_date"] = f"{m.group(3)[:4]}-{m.group(3)[4:6]}-{m.group(3)[6:8]}"
        meta["form_type"] = "SEC-filing"
        return meta

    # Pattern: index.md
    if name == "index":
        meta["form_type"] = "index"
        return meta

    # Pattern: urls.md
    if name == "urls":
        meta["form_type"] = "urls"
        return meta

    # Pattern: TSM_2024_20F
    if "20F" in name or "20-F" in name:
        meta["form_type"] = "20-F"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = f"FY{m.group(1)}"
        return meta

    # Pattern: KBANK_Brief_2Q24 or similar
    if "Brief" in name or "OneReport" in name:
        meta["form_type"] = "quarterly-report" if "Brief" in name else "annual-report"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # Pattern: OppDay (investor day)
    if "OppDay" in name or "oppday" in name.lower():
        meta["form_type"] = "investor-day"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # Pattern: Annual Report files like AR_2020_en or 20210401-kamart-ar2020-en
    if name.startswith("AR_") or name.startswith("ar-") or "-ar" in name.lower():
        meta["form_type"] = "annual-report"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = f"FY{m.group(1)}"
        return meta

    # Pattern: Presentation files like KBANK_Presentation_3Q25
    if "Presentation" in name or "presentation" in name.lower():
        meta["form_type"] = "presentation"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # Pattern: FS (financial statement) files like SISB_FS_Q1_2024
    if "_FS_" in name or name.startswith("FS"):
        meta["form_type"] = "financial-statement"
        m = re.search(r"(\d{4})", name)
        if m:
            meta["fiscal_period"] = m.group(1)
        return meta

    # Pattern: SEC accession number files (longer pattern)
    m = re.match(r"^(\d{10,18})-(\w+)-(\d{8})$", name)
    if m:
        meta["accession_number"] = m.group(1)
        meta["filing_date"] = f"{m.group(3)[:4]}-{m.group(3)[4:6]}-{m.group(3)[6:8]}"
        meta["form_type"] = "SEC-filing"
        return meta

    # Generic fallback
    meta["form_type"] = "unknown"
    return meta


def has_frontmatter(filepath: Path) -> bool:
    """Check if file already has YAML frontmatter."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            first_line = f.readline().strip()
            if first_line != '---':
                return False
            second_line = f.readline().strip()
            return ':' in second_line
    except:
        return False


def inject_frontmatter(filepath: Path, dry_run: bool = False, update: bool = False) -> dict:
    """Inject frontmatter into a file. Returns result dict."""
    meta = parse_filename_metadata(filepath)
    if not meta:
        return {"file": str(filepath), "status": "skipped", "reason": "could not parse metadata"}

    # Build frontmatter
    fm_lines = ["---"]
    for key in ["cik", "ticker", "company", "form_type", "filing_date", "accession_number", "fiscal_period", "fiscal_year_end"]:
        if key in meta and meta[key]:
            fm_lines.append(f"{key}: {meta[key]}")
    fm_lines.append("---")

    frontmatter = "\n".join(fm_lines) + "\n\n"

    if dry_run:
        return {"file": str(filepath), "status": "would_inject", "frontmatter": frontmatter.strip(), "meta": meta}

    if update and has_frontmatter(filepath):
        # Remove existing frontmatter first
        try:
            with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
        except Exception as e:
            return {"file": str(filepath), "status": "error", "reason": str(e)}

        if content.startswith('---'):
            end = content.find('---', 3)
            if end != -1:
                content = content[end + 3:].lstrip('\n')

        new_content = frontmatter + content
    elif not update and has_frontmatter(filepath):
        return {"file": str(filepath), "status": "skipped", "reason": "already has frontmatter"}
    else:
        # Read existing content
        try:
            with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
        except Exception as e:
            return {"file": str(filepath), "status": "error", "reason": str(e)}

        new_content = frontmatter + content

    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return {"file": str(filepath), "status": "injected", "meta": meta}
    except Exception as e:
        return {"file": str(filepath), "status": "error", "reason": str(e)}


def main():
    parser = argparse.ArgumentParser(description="Inject YAML frontmatter into stock filing markdown files")
    parser.add_argument("--batch", action="store_true", help="Process all files missing frontmatter")
    parser.add_argument("--ticker", type=str, help="Process files for a specific ticker")
    parser.add_argument("--update", action="store_true", help="Update frontmatter for ALL files (re-parse)")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done without modifying files")
    args = parser.parse_args()

    if not args.batch and not args.ticker and not args.update:
        parser.print_help()
        sys.exit(1)

    # Ensure audit directory exists
    AUDIT_DIR.mkdir(parents=True, exist_ok=True)

    # Collect files to process
    files_to_process = []

    if args.ticker:
        ticker_dir = BASE_DIR / args.ticker
        if not ticker_dir.exists():
            print(f"Error: Ticker directory not found: {ticker_dir}")
            sys.exit(1)
        for root, dirs, files in os.walk(ticker_dir):
            for f in files:
                if f.endswith('.md'):
                    files_to_process.append(Path(root) / f)
    elif args.update:
        for root, dirs, files in os.walk(BASE_DIR):
            for f in files:
                if f.endswith('.md'):
                    files_to_process.append(Path(root) / f)
    else:
        # batch mode: only files missing frontmatter
        for root, dirs, files in os.walk(BASE_DIR):
            for f in files:
                if f.endswith('.md'):
                    filepath = Path(root) / f
                    if not has_frontmatter(filepath):
                        files_to_process.append(filepath)

    print(f"Files to process: {len(files_to_process)}")

    results = []
    for filepath in sorted(files_to_process):
        result = inject_frontmatter(filepath, dry_run=args.dry_run, update=args.update)
        results.append(result)
        status = result.get("status", "unknown")
        if status == "injected":
            print(f"  ✓ {result['file']}")
        elif status == "would_inject":
            print(f"  [DRY] {result['file']}")
        elif status == "error":
            print(f"  ✗ {result['file']}: {result.get('reason', '')}")
        elif status == "skipped":
            print(f"  - {result['file']}: {result.get('reason', '')}")

    # Write audit log
    injected = [r for r in results if r.get("status") in ("injected", "would_inject")]
    errors = [r for r in results if r.get("status") == "error"]
    skipped = [r for r in results if r.get("status") == "skipped"]

    print(f"\nSummary:")
    print(f"  Injected: {len(injected)}")
    print(f"  Errors: {len(errors)}")
    print(f"  Skipped: {len(skipped)}")

    # Append to audit CSV
    if not args.dry_run and injected:
        with open(AUDIT_CSV, 'a', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            if not AUDIT_CSV.exists() or AUDIT_CSV.stat().st_size == 0:
                writer.writerow(["timestamp", "file", "ticker", "form_type", "status"])
            for r in injected:
                meta = r.get("meta", {})
                writer.writerow([
                    datetime.now().isoformat(),
                    r["file"],
                    meta.get("ticker", ""),
                    meta.get("form_type", ""),
                    r["status"]
                ])
        print(f"  Audit log: {AUDIT_CSV}")

    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())