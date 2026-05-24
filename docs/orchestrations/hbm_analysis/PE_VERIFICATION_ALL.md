# P/E Ratio Verification: Micron (MU) & Samsung (005930.KS)

**Date:** May 16, 2026  
**Purpose:** Cross-source verification of trailing and forward P/E ratios. User expects P/E < 10× for both (like SK Hynix corrected to 5.5×).

---

## ⚠️ CRITICAL FINDING: NEITHER MU NOR SAMSUNG HAS P/E < 10× ON A TRAILING BASIS

| Company | Trailing P/E | Forward P/E (FY2026E) | User Expectation (<10×) |
|---------|-------------|----------------------|--------------------------|
| **Micron (MU)** | **34–38×** | **~12×** | ❌ FAILS on trailing; ✅ Forward close |
| **Samsung (005930)** | **21.5×** | **5.4–7.0×** | ❌ FAILS on trailing; ✅ Forward passes |
| SK Hynix (ref) | ~5.5× (corrected) | — | ✅ |

---

## 1. MICRON TECHNOLOGY (MU) — Detailed Verification

### Current Share Price
| Source | Price | Date |
|--------|-------|------|
| Yahoo Finance | $766.58 (May 12 close) | May 12, 2026 |
| StockAnalysis | $724.66 (May 15 close) | May 15, 2026 |
| Morningstar | $803.63 | May 13, 2026 |
| WallStreetNumbers | $766.58 | May 12, 2026 |

**Most recent confirmed close: $724.66 (May 15, 2026)** — StockAnalysis

### TTM EPS (Actual Reported)
| Source | TTM EPS | Notes |
|--------|---------|-------|
| StockAnalysis | $21.26 | TTM net income $24.11B ÷ 1.13B shares |
| MacroTrends | ~$21.18 (as of Feb 2026) | Slightly stale |
| Micron FY2025 10-K (GAAP) | $7.59 (FY2025 only, ended Aug 28, 2025) | Annual, not TTM |

**Best TTM EPS: ~$21.26** (StockAnalysis, includes post-FY2025 quarters)

**Note:** Micron's FY ends in August. FY2025 GAAP EPS was $7.59. But TTM now includes Q1+Q2 FY2026 earnings which are dramatically higher ($3.75+ per quarter), pushing TTM EPS to ~$21.

### FY2025 Actual Results (Filed)
| Metric | GAAP | Non-GAAP |
|--------|------|----------|
| Revenue | $37.38B | $37.38B |
| Net Income | $8.54B | $9.47B |
| Diluted EPS | **$7.59** | **$8.29** |

**Source:** Micron press release (GlobeNewswire, Sept 23, 2025); SEC 10-K filing

### FY2026E Consensus EPS
| Source | FY2026E EPS | Period Ending |
|--------|------------|---------------|
| StockAnalysis/Finnhub | **$59.18** (avg) | Aug 28, 2026 |
| Range | $36.79 – $67.59 | |
| No. Analysts | 46 | |

**Source:** StockAnalysis forecast page (Finnhub data)

### Calculated P/E Ratios
| Metric | Calculation | Result |
|--------|------------|--------|
| **Trailing P/E** | $724.66 ÷ $21.26 | **34.1×** |
| StockAnalysis reported trailing P/E | — | **37.80×** (uses slightly different EPS basis) |
| MacroTrends reported | — | **34.21×** (May 14) |
| WallStreetNumbers | — | **36.19×** |
| **Forward P/E (FY2026E)** | $724.66 ÷ $59.18 | **12.2×** |
| StockAnalysis reported forward P/E | — | **8.66×** |

**⚠️ DISCREPANCY NOTE on MU Forward P/E:**  
StockAnalysis reports forward P/E of 8.66×, but their own FY2026E EPS is $59.18, which gives $724.66/$59.18 = 12.2×. The 8.66× likely uses a different (higher) forward EPS estimate or a different price snapshot. This needs clarification — the 8.66× may be based on a blended or next-12-month estimate rather than FY2026E.

---

## 2. SAMSUNG ELECTRONICS (005930.KS) — Detailed Verification

### Current Share Price
| Source | Price (KRW) | Date |
|--------|-------------|------|
| Yahoo Finance | 201,000 (Jan 2026 close) | Stale |
| StockAnalysis | **270,500** (May 15 close) | May 15, 2026 |
| Yahoo Finance (recent) | 266,000–284,000 | May 2026 range |

**Most recent confirmed close: ₩270,500 (May 15, 2026)** — StockAnalysis

### TTM EPS (Actual Reported)
| Source | TTM EPS (KRW) | Notes |
|--------|--------------|-------|
| StockAnalysis | **₩12,572.95** | TTM net income ₩83.36T ÷ 6.65B shares |

### FY2025 Actual Results (Filed)
| Metric | Value |
|--------|-------|
| Consolidated Revenue | **₩333.6 trillion** |
| Operating Profit | ₩43.6 trillion |
| Net Income | **₩45.2 trillion** |
| Net Income Growth | +31.2% YoY |

**Source:** Samsung Electronics press release (Jan 29, 2026); Yonhap News Agency

**Note:** Samsung FY2025 net income of ₩45.2T ÷ 6.65B shares = ~₩6,796 per share (FY2025 only). TTM includes Q1 2026 which was massive (₩133.9T revenue, ₩57.2T operating profit), pushing TTM EPS to ₩12,573.

### Q1 2026 Results (Latest Quarter)
| Metric | Value |
|--------|-------|
| Consolidated Revenue | ₩133.9 trillion (all-time high) |
| Operating Profit | ₩57.2 trillion (all-time high) |
| DS Division Revenue | ₩81.7 trillion |
| DS Division Operating Profit | ₩53.7 trillion |

**Source:** Samsung Electronics Q1 2026 press release (Apr 30, 2026)

### FY2026E Consensus EPS
| Source | Forward P/E | Implied FY2026E EPS |
|--------|------------|-------------------|
| StockAnalysis | **5.42×** | ₩270,500 ÷ 5.42 = ~₩49,900 |
| ValueInvesting.io | **7.02×** | ₩270,500 ÷ 7.02 = ~₩38,530 |
| Eulerpool | **34.64×** | Likely stale/pre-Q1 data |

**Best Forward P/E estimate: 5.4–7.0×** (StockAnalysis and ValueInvesting.io agree on low single digits)

### Calculated P/E Ratios
| Metric | Calculation | Result |
|--------|------------|--------|
| **Trailing P/E** | ₩270,500 ÷ ₩12,573 | **21.5×** |
| StockAnalysis reported trailing P/E | — | **21.51×** ✅ Matches |
| **Forward P/E (FY2026E)** | StockAnalysis: 5.42× | **5.4×** |
| ValueInvesting.io | — | **7.02×** |

---

## 3. CROSS-SOURCE COMPARISON

### Micron (MU) P/E Across Sources
| Source | Trailing P/E | Forward P/E |
|--------|-------------|------------|
| StockAnalysis | 37.80× | 8.66× |
| MacroTrends | 34.21× | — |
| WallStreetNumbers | 36.19× | — |
| Morningstar | — | — (fair value $282) |
| **Calculated (my own)** | **34.1×** | **12.2×** |

**Consensus Trailing P/E for MU: ~34–38×**  
**Consensus Forward P/E for MU: ~8.7–12.2×** (wide range due to EPS estimate methodology)

### Samsung (005930.KS) P/E Across Sources
| Source | Trailing P/E | Forward P/E |
|--------|-------------|------------|
| StockAnalysis | 21.51× | 5.42× |
| ValueInvesting.io | — | 7.02× |
| Eulerpool | — | 34.64× (stale) |
| **Calculated (my own)** | **21.5×** | **5.4–7.0×** |

**Consensus Trailing P/E for Samsung: ~21.5×**  
**Consensus Forward P/E for Samsung: ~5.4–7.0×**

---

## 4. KEY INSIGHTS & WARNINGS

### ⚠️ MU Trailing P/E is 34–38×, NOT < 10×
- MU's trailing P/E is extremely high because the stock price has surged 660% in 52 weeks
- The TTM EPS of ~$21 includes only 2 quarters of the AI-driven earnings boom
- FY2025 GAAP EPS was only $7.59 (the "base" year)
- Forward P/E of ~8.7–12× is much more favorable, but depends on FY2026E EPS of $59.18 actually materializing

### ⚠️ Samsung Trailing P/E is 21.5×, NOT < 10×
- Samsung's trailing P/E of 21.5× reflects the massive Q1 2026 earnings already baked into TTM
- Forward P/E of 5.4–7.0× is very attractive and below 10×
- The discrepancy between trailing and forward is because Q1 2026 was an extraordinary quarter (₩57.2T operating profit) and the market expects some normalization

### Why SK Hynix Was Different at 5.5×
- SK Hynix's corrected 5.5× P/E was likely a **forward** P/E, not trailing
- SK Hynix is a pure-play memory company with earnings more directly tied to the current AI/HBM cycle
- Samsung's conglomerate structure (DX, SDC divisions) dilutes the memory-driven earnings multiple

### Forward P/E Comparison (Apples-to-Apples)
| Company | Forward P/E (FY2026E) |
|---------|----------------------|
| SK Hynix | ~5.5× (corrected) |
| Samsung | ~5.4–7.0× |
| Micron | ~8.7–12.2× |

**Only on a FORWARD basis do Samsung and SK Hynix approach < 10×. MU's forward P/E is borderline.**

---

## 5. SOURCE CITATIONS

1. **StockAnalysis (MU Statistics):** https://stockanalysis.com/stocks/mu/statistics/ — Price $724.66, TTM EPS $21.26, Trailing P/E 37.80, Forward P/E 8.66
2. **StockAnalysis (MU Forecast):** https://stockanalysis.com/stocks/mu/forecast/ — FY2026E EPS $59.18 (avg), Revenue $112.0B
3. **MacroTrends (MU P/E):** https://www.macrotrends.net/stocks/charts/MU/micron-technology/pe-ratio — P/E 34.21 as of May 14, 2026
4. **WallStreetNumbers (MU):** https://wallstreetnumbers.com/stocks/mu — P/E 36.19, Price $766.58
5. **Morningstar (MU):** https://kessler-prod.reta52d8.eas.morningstar.com/stocks/xnas/mu/quote — Price $803.63, Fair Value $282
6. **Micron FY2025 Earnings Release:** https://www.globenewswire.com/news-release/2025/09/23/3155077/14450/en/ — Revenue $37.38B, GAAP EPS $7.59, Non-GAAP EPS $8.29
7. **SEC 10-K Filing (MU):** https://www.sec.gov/Archives/edgar/data/723125/000072312525000040/202510karscopy.pdf
8. **StockAnalysis (Samsung Statistics):** https://stockanalysis.com/quote/krx/005930/statistics/ — Price ₩270,500, TTM EPS ₩12,573, Trailing P/E 21.51, Forward P/E 5.42
9. **Samsung FY2025 Results:** https://news.samsungsemiconductor.com/global/samsung-electronics-announces-fourth-quarter-and-fy-2025-results/ — Revenue ₩333.6T, Operating Profit ₩43.6T
10. **Yonhap (Samsung FY2025):** https://en.yna.co.kr/view/AEN20260129001100320 — Net Income ₩45.2T, +31.2% YoY
11. **Samsung Q1 2026 Results:** https://news.samsung.com/global/samsung-electronics-announces-first-quarter-2026-results — Revenue ₩133.9T, Operating Profit ₩57.2T
12. **ValueInvesting.io (Samsung Forward P/E):** https://valueinvesting.io/005930.KS/metric/forward-pe — Forward P/E 7.02
13. **Eulerpool (Samsung Forward P/E):** https://eulerpool.com/stock/Samsung-Electronics-Stock-KR7005930003/forwardpe — Forward P/E 34.64 (likely stale)
14. **Yahoo Finance (MU):** https://finance.yahoo.com/quote/MU/ — Price $766.58 (May 12)
15. **Yahoo Finance (Samsung):** https://finance.yahoo.com/quote/005930.KS/ — Various price snapshots

---

*Document generated: May 16, 2026. All data as of most recent available close (May 15, 2026 for StockAnalysis).*