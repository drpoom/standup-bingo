#!/usr/bin/env python3
"""
Rebuild stock_index.yaml and libraries_index.yaml from frontmatter in markdown files.
"""

import os
import re
import yaml
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).parent.parent / "investments" / "stocks"
INDICES_DIR = Path(__file__).parent.parent / "indices"
INDICES_DIR.mkdir(parents=True, exist_ok=True)


def parse_frontmatter(filepath: Path) -> dict:
    """Extract YAML frontmatter from a markdown file."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
    except Exception as e:
        return {}

    if not content.startswith('---'):
        return {}

    # Find end of frontmatter
    end = content.find('---', 3)
    if end == -1:
        return {}

    fm_text = content[3:end].strip()
    try:
        # Use BaseLoader to avoid auto-converting date strings to datetime objects
        return yaml.load(fm_text, Loader=yaml.BaseLoader) or {}
    except yaml.YAMLError:
        return {}


def build_stock_index():
    """Build stock_index.yaml from all stock filing markdown files."""
    stocks = defaultdict(lambda: {"ticker": "", "company": "", "filings": []})

    for root, dirs, files in os.walk(BASE_DIR):
        for f in sorted(files):
            if not f.endswith('.md'):
                continue

            filepath = Path(root) / f
            fm = parse_frontmatter(filepath)
            if not fm:
                continue

            ticker = fm.get("ticker", "")
            if not ticker:
                # Try to extract from path
                parts = filepath.parts
                for i, p in enumerate(parts):
                    if p == "stocks" and i + 1 < len(parts):
                        ticker = parts[i + 1]
                        break

            if not ticker:
                continue

            entry = stocks[ticker]
            entry["ticker"] = ticker
            if fm.get("company"):
                entry["company"] = fm["company"]

            filing_entry = {
                "path": str(filepath),
                "filename": f,
            }
            for key in ["form_type", "filing_date", "fiscal_period", "fiscal_year_end", "accession_number", "cik", "source_url"]:
                if key in fm and fm[key]:
                    filing_entry[key] = fm[key]

            entry["filings"].append(filing_entry)

    # Build final structure
    result = {}
    for ticker in sorted(stocks.keys()):
        data = stocks[ticker]
        result[ticker] = {
            "company": data["company"],
            "cik": data["filings"][0].get("cik", "") if data["filings"] else "",
            "filing_count": len(data["filings"]),
            "filings": data["filings"],
        }

    return result


def build_libraries_index():
    """Build libraries_index.yaml - a lightweight index grouping by form_type."""
    by_type = defaultdict(list)

    for root, dirs, files in os.walk(BASE_DIR):
        for f in sorted(files):
            if not f.endswith('.md'):
                continue

            filepath = Path(root) / f
            fm = parse_frontmatter(filepath)
            if not fm:
                continue

            form_type = fm.get("form_type", "unknown")
            ticker = fm.get("ticker", "unknown")

            by_type[form_type].append({
                "ticker": ticker,
                "company": fm.get("company", ""),
                "path": str(filepath),
                "filing_date": fm.get("filing_date", ""),
                "fiscal_period": fm.get("fiscal_period", ""),
            })

    return dict(sorted(by_type.items()))


def main():
    print("Building stock_index.yaml...")
    stock_index = build_stock_index()
    stock_path = INDICES_DIR / "stock_index.yaml"
    with open(stock_path, 'w', encoding='utf-8') as f:
        yaml.dump(stock_index, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
    print(f"  Written: {stock_path}")
    print(f"  Tickers: {len(stock_index)}")
    total_filings = sum(v["filing_count"] for v in stock_index.values())
    print(f"  Total filings: {total_filings}")

    print("\nBuilding libraries_index.yaml...")
    lib_index = build_libraries_index()
    lib_path = INDICES_DIR / "libraries_index.yaml"
    with open(lib_path, 'w', encoding='utf-8') as f:
        yaml.dump(lib_index, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
    print(f"  Written: {lib_path}")
    print(f"  Form types: {len(lib_index)}")
    for ft, entries in sorted(lib_index.items()):
        print(f"    {ft}: {len(entries)} filings")


if __name__ == "__main__":
    main()