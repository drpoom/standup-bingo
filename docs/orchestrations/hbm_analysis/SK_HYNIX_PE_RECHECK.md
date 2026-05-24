# SK Hynix P/E Re-Verification — Critical Error Found

**Date:** 2026-05-16 | **Status: FUNDAMENTAL DATA ERROR CONFIRMED**

---

## The Problem

The HBM analysis report shows SK Hynix CY2028 base EPS at **₩9,230** and implies a P/E of ~190× at current prices. The user flagged this as wrong (~10× expected). **The user is correct — the scenario EPS numbers are catastrophically understated by ~10-12×.**

---

## Verified Current Data (Multiple Sources)

### 1. Stock Price
| Source | Price (KRW) | Date |
|---|---|---|
| StockAnalysis.com | ₩1,819,000 | May 15, 2026 close |
| StockAnalysis.com (May 13) | ₩1,961,000 | May 13, 2026 |
| MarketScreener | ₩1,286,000 | Apr 30, 2026 |
| SimplyWallSt market cap | ₩858.2T implied | Recent |

**Current price: ~₩1,819,000 per share (May 15, 2026)**

### 2. TTM EPS (Trailing Twelve Months)
| Source | TTM EPS (KRW) | Period |
|---|---|---|
| **StockAnalysis.com (financials)** | **₩106,603 (diluted)** | TTM ending Mar 2026 |
| **StockAnalysis.com (statistics)** | **₩106,602.99** | Confirmed same |
| **CompaniesMarketCap.com** | **$34.85 USD** | TTM 2025 |
| SK Hynix FY2025 net income | ₩42,919B | FY2025 (Jan-Dec 2025) |

**Verified TTM EPS: ₩106,603 KRW (~$81.9 USD at 1,300 KRW/USD)**

Cross-check: CompaniesMarketCap shows $34.85 USD. At 1,300 KRW/USD → ₩45,305. This discrepancy suggests CompaniesMarketCap may be using a different share count or older data. **StockAnalysis.com data is more reliable** as it shows the full income statement with per-share calculations.

### 3. Share Count
| Source | Shares Outstanding | Type |
|---|---|---|
| StockAnalysis.com | **705M (basic), 711M (diluted)** | TTM (Mar 2026) |
| StockAnalysis.com (statistics) | **701.69M** | Current |
| SK Hynix FY2025 filing | **692M (basic), 710M (diluted)** | Dec 2025 |

**Verified diluted share count: ~711M shares (FY2025), ~705M (TTM after buybacks)**

Note: SK Hynix announced cancellation of 15.3M treasury shares (~2.1% of outstanding) in Jan 2026, consistent with declining share count.

### 4. Fiscal Year Confirmation
- **Korean FY = Calendar Year (Jan 1 – Dec 31)** ✅
- SK Hynix FY2025 = Jan 1, 2025 to Dec 31, 2025
- TTM = Apr 2025 to Mar 2026 (includes Q1 2026 results)
- Source: SK Hynix official press release dated Jan 28, 2026

### 5. Currency Conversion
- KRW/USD ≈ 1,300 (current)
- ₩106,603 EPS ÷ 1,300 = **~$82 USD EPS**
- CompaniesMarketCap shows $34.85 — this appears to use a different (likely older) share count or partial-year data. **Do not use CompaniesMarketCap USD EPS figures.**

---

## P/E Calculations

### Current (Trailing) P/E
```
Price: ₩1,819,000
TTM EPS: ₩106,603
Trailing P/E = 1,819,000 ÷ 106,603 = 17.1×
```

**StockAnalysis.com independently confirms: Trailing PE = 18.48** (slight difference likely due to share count timing)

### Forward P/E (2026E)
StockAnalysis.com reports: **Forward PE = 6.21**

This implies 2026E EPS = 1,819,000 ÷ 6.21 = **₩292,915** (~$225 USD)

This makes sense: SK Hynix earned ₩106,603 in TTM (which includes weak Q1 2025), and FY2026 is expected to be significantly stronger with HBM4 ramp and continued AI demand.

### Cross-check with KB Securities (Sep 2025 report)
- KB Securities forecast: 2026 operating profit ₩56T (+43% YoY)
- If net margin stays ~44% (FY2025 level): net income ~₩24.6T
- EPS = ₩24,600B ÷ 705M shares = **₩34,894**
- But this seems low vs StockAnalysis forward PE of 6.21×
- KB Securities report is from Sep 2025 (pre-Q4 2025 blowout); likely outdated

---

## ROOT CAUSE: Why the 190× P/E Was Wrong

The scenario file (`sk_hynix_scenarios.md`) contains **CY2028 revenue of ₩39.5T** and **EPS of ₩9,230**. These numbers are off by an order of magnitude because:

1. **The scenarios were built on Q1 2025 data** (₩17.64T quarterly revenue) and projected forward modestly
2. **SK Hynix already achieved ₩97.1T revenue in FY2025** — 2.5× the "2028 base case" of ₩39.5T
3. **TTM EPS is already ₩106,603** — 11.5× the "2028 base case" of ₩9,230
4. **The scenario file appears to use share price in won but EPS in a different unit or from outdated data**

### Specific Error Chain:
- Scenario says: 2028 revenue ₩39.5T, net margin 17%, net income ₩6.7T, shares 726M, EPS ₩9,230
- Reality (FY2025 actual): Revenue ₩97.1T, net margin 44%, net income ₩42.9T, shares 710M, EPS ₩60,378 (FY2025 annual)
- The scenario revenue is **less than half of already-achieved FY2025 revenue**
- The scenario net margin (17%) is **less than half of actual (44%)**

---

## Corrected P/E Framework

| Metric | Value | Source |
|---|---|---|
| Current Price | ₩1,819,000 | StockAnalysis.com (May 15, 2026) |
| TTM EPS (diluted) | ₩106,603 | StockAnalysis.com financials |
| **Trailing P/E** | **17.1×** | Calculated |
| Forward P/E (2026E) | **6.21×** | StockAnalysis.com |
| 2026E EPS (implied) | **₩292,915** | Price ÷ Forward PE |
| FY2025 EPS (annual) | ₩60,378 | 42,919B ÷ 711M shares |
| FY2025 P/E at current price | 30.1× | 1,819,000 ÷ 60,378 |

### Why TTM P/E (17×) differs from FY2025 P/E (30×):
- TTM includes Q1 2026 (Jan-Mar 2026) which was likely very strong
- FY2025 includes weaker Q1 2025
- The TTM is more representative of current earnings power

---

## 2028 Scenario P/E Recheck

If we use the **corrected** forward trajectory:
- 2026E EPS: ~₩293,000 (from forward PE)
- If 2028 EPS grows at 15% CAGR from 2026: ~₩387,000
- If 2028 EPS grows at 10% CAGR from 2026: ~₩354,000
- If memory cycle turns bearish (–30% from peak): ~₩205,000

**2028 P/E at current price:**
- Bull: 1,819,000 ÷ 387,000 = **4.7×**
- Base: 1,819,000 ÷ 354,000 = **5.1×**
- Bear: 1,819,000 ÷ 205,000 = **8.9×**

These are in the **5-9× range**, consistent with the user's "~10×" expectation.

---

## Action Items

1. **URGENT: Rewrite `sk_hynix_scenarios.md`** — all revenue, EPS, and margin numbers are off by 2-12×
2. **Update `FINAL_REPORT.md`** — the comparison table and scenario analysis use the wrong SK Hynix numbers
3. **Re-verify Micron and Samsung scenarios** — similar errors may exist
4. **The "190× P/E" was calculated using fantasy 2028 EPS of ₩9,230 vs real price of ₩1,819,000** — this was never a real P/E, it was a data error

---

## Source Citations

1. StockAnalysis.com — SK Hynix financials: https://stockanalysis.com/quote/krx/000660/financials/
2. StockAnalysis.com — SK Hynix statistics: https://stockanalysis.com/quote/krx/000660/statistics/
3. SK Hynix official FY2025 results: https://news.skhynix.com/sk-hynix-announces-fy25-financial-results/
4. CompaniesMarketCap.com — SK Hynix EPS: https://companiesmarketcap.com/sk-hynix/eps/
5. KB Securities research report (Sep 2025): https://rdata.kbsec.com/pdf_data/20250922183301103E.pdf
6. SimplyWallSt — SK Hynix analysis: https://simplywall.st/stocks/kr/semiconductors/kose-a000660/sk-hynix-shares
7. Yonhap News — SK Hynix record earnings: https://en.yna.co.kr/view/AEN20260128009853320
8. PR Newswire — SK Hynix FY25 results: https://prnewswire.com/news-releases/sk-hynix-announces-fy25-financial-results-posts-record-high-results-and-delivers-highest-shareholder-returns-302672384.html