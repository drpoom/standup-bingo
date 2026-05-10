# QA Report — AI Mega-Analysis

**Date:** 2026-05-11  
**Auditor:** Scout QA (automated)  
**Scope:** 67 companies, 10 layers, protocol compliance verification

---

## Overall Verdict: ⚠️ PARTIAL PASS (2 of 4 checks pass)

---

## Q1: Wiki Reuse Check — ✅ PASS

**Finding:** All 30 wiki files in `ai-mega-analysis/wiki/` are **identical copies** from `semiconductor-mega-analysis/wiki/`. Zero differences detected.

| Metric | Count |
|--------|-------|
| Wiki files reused (identical) | 30 |
| Wiki files different | 0 |
| Total semi wiki files | 30 |
| Total AI wiki files | 30 |

**Reuse mapping in `master-list.yaml`** explicitly lists 29 companies under `reuse_from_semi` (MRVL appears in L1 and L7 but counted once). The 30th wiki file (QCOM.md) exists in both directories but isn't in the reuse list — likely an extra carry-over.

**Batch source attribution confirms reuse:**
- B1: "semiconductor-mega-analysis/wiki/ (9 companies) + fresh web research (Kioxia)"
- B2: "semiconductor-mega-analysis/wiki/ (9 cos) + ARM FYE25 SEC filing (1 cos)"
- B3: "semiconductor-mega-analysis/wiki/ (8 cos), web search (SIE.DE, 1810.HK)"
- B4/B4a/B4b/B5: Fresh web research (no semi overlap)

**Verdict:** ✅ Warren properly reused existing wiki data for all 30 semiconductor companies. Remaining 37 non-semi companies were researched fresh.

---

## Q2: Frontmatter Check — ❌ FAIL

**Finding:** The financial batch files (`batch-b1.md` through `batch-b5.md`) use **Markdown table format** per company, NOT per-company YAML frontmatter with the required fields (company, ticker, year, layer, country, fiscal_end).

**What exists:** Each company section has a Markdown table with metrics like Region, Sub-Sector, Market Cap, Revenue, etc., but these are **not** structured as YAML frontmatter blocks.

**Required fields missing:**
- `company:` — present as inline heading, not YAML
- `ticker:` — present in heading, not YAML
- `year:` — not in YAML format (embedded in metric names like "Revenue (FY2024)")
- `layer:` — not present at all
- `country:` — "Region" is present but not as `country:`
- `fiscal_end:` — not present

**Verdict:** ❌ FAIL — Batch files use Markdown tables instead of per-company YAML frontmatter. No individual per-company files exist either (only batch files).

**Recommendation:** Either:
1. Add YAML frontmatter blocks to each company section within batch files, OR
2. Create individual per-company financial files with proper YAML frontmatter

---

## Q3: Index Rebuild Check — ❌ FAIL

**Finding:** **Zero** of the 66 unique AI mega-analysis tickers appear in `investments/indices/stock_index.yaml`. The index contains only pre-existing entries (Samsung, AAPL, etc. from prior work).

**Missing companies (all 66):** All AI mega-analysis companies are missing from the index, including:
- L1: NVDA, AMD, AVGO, MRVL, INTC, 005930.KS, 000660.KS
- L2: MU, WDC, 6645.T
- L3: SNPS, CDNS, ARM
- L4: ASML, AMAT, LRCX, KLAC, 8035.T, 6702.T, 4063.T
- L5: 2330.TW, 3711.TW, 0981.HK, 6723.T
- L6: TXN, ADI, STM, IFX, ON, NXPI, MPWR, 6861.T, SIE.DE, 1810.HK
- L7: ANET, CIEN, FSLY
- L8: MSFT, GOOGL, AMZN, META, ORCL, 9988.HK, 0700.HK, 9888.HK, DTE.DE, 3896.HK
- L9: PLTR, SNOW, DDOG, MDB, AI, PATH, APLS, SAP.DE, 0020.HK, 1024.HK, BNTX.DE, QIA.DE
- L10: VST, CEG, GEV, ETN, VRT, SMID, 0992.HK

**Note:** Some tickers like Samsung (005930.KS) and AAPL already exist in the index from prior semiconductor work, but the AI-specific entries were not added.

**Verdict:** ❌ FAIL — The stock index was not rebuilt with the 67 AI companies.

**Recommendation:** Run index rebuild to add all 66 unique AI tickers to `stock_index.yaml`.

---

## Q4: Watchlist Check — ❌ FAIL

**Finding:** The `investments/WATCHLIST.md` was **not updated** with the new AI mega-analysis companies. Only the original watchlist entries exist (TSM, SK Hynix, MU, Samsung, GOOGL, AAPL, Hesai, Xiaomi, Trip + Thai stocks).

**Missing major AI tickers:**
- META (Meta Platforms)
- MSFT (Microsoft)
- AMZN (Amazon)
- NVDA (NVIDIA)
- AMD
- AVGO (Broadcom)
- ARM
- ANET (Arista)
- PLTR (Palantir)
- VST (Vistra)
- CEG (Constellation)
- GEV (GE Vernova)
- ETN (Eaton)
- VRT (Vertiv)
- SMID (Super Micro)
- ORCL (Oracle)
- SNOW (Snowflake)
- DDOG (Datadog)
- SAP.DE (SAP)
- SIE.DE (Siemens)
- BNTX.DE (BioNTech)
- And 40+ more...

**Verdict:** ❌ FAIL — Watchlist was not updated with AI mega-analysis companies.

**Recommendation:** Add all 67 AI companies (or at minimum the major liquid ones) to `investments/WATCHLIST.md` with sector and notes.

---

## Summary

| Check | Verdict | Details |
|-------|---------|---------|
| Q1: Wiki Reuse | ✅ PASS | 30/30 wiki files properly reused from semiconductor analysis |
| Q2: Frontmatter | ❌ FAIL | No YAML frontmatter; batch files use Markdown tables only |
| Q3: Index Rebuild | ❌ FAIL | 0/66 AI tickers added to stock_index.yaml |
| Q4: Watchlist | ❌ FAIL | 0/67 AI companies added to WATCHLIST.md |

**Overall: ⚠️ PARTIAL PASS** — Wiki reuse was done correctly, but frontmatter, index rebuild, and watchlist updates were skipped.

### Priority Fixes
1. **High:** Add AI tickers to `stock_index.yaml` (index rebuild)
2. **High:** Add AI companies to `investments/WATCHLIST.md`
3. **Medium:** Add YAML frontmatter to financial batch files (or create individual per-company files)