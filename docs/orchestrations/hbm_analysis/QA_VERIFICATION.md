# QA Verification — HBM Report EPS & P/S Calculations

**Date:** 2026-05-16 | **Verified by:** QA subagent

---

## 1. Current Market Data (as of May 15, 2026)

| Company | Ticker | Share Price | Shares Outstanding | Market Cap | TTM Revenue | TTM EPS |
|---|---|---|---|---|---|---|
| **Micron** | MU | $724.66 | 1.13B | $817B | $58.12B | $21.26 |
| **SK Hynix** | 000660.KS | ₩1,819,000 | 701.69M | ₩1,382.33T | ₩132.08T | ₩106,603 |
| **Samsung** | 005930.KS | ₩270,500 | 6.65B | ₩1,725.36T | ₩388.41T | ₩12,573 |

---

## 2. 2026E Consensus EPS Verification

### Micron (MU)
- **Report's implied CY2026E EPS:** Not explicitly stated in report, but revenue bridge shows ~$52B CY2026E
- **Street consensus FY2026 (ending Aug 2026):** **$59.18** (StockAnalysis/Finnhub, 46 analysts)
  - Range: $36.79 – $67.59
  - Revenue consensus: $112.0B (FY2026)
- **⚠️ MAJOR DISCREPANCY:** The report's CY2026E revenue of ~$52B is dramatically below Street consensus of $112B for FY2026. This appears to be a **calendar year vs. fiscal year mismatch** — Micron's FY ends in August, so CY2026 roughly = H2 FY26 + H1 FY27. The report's $52B CY2026E figure appears to be using an outdated or incorrect revenue estimate. At the current TTM run rate of $58.12B (as of mid-2026), CY2026 revenue should be well above $52B.
- **Correction needed:** CY2026E revenue should be ~$90-112B range, not $52B

### SK Hynix (000660.KS)
- **Report's CY2026E:** Not explicitly stated, but base case CY2028 revenue is ₩39.5T
- **Street consensus 2026E EPS:** ~₩160,368 (SimplyWall.St, 37 analysts, as of Jan 2026)
- **Current TTM EPS:** ₩106,603 (StockAnalysis)
- **2026 operating profit consensus:** ₩122-185T (10 Korean brokerages, Feb 2026)
- **Report's share count:** ~726M → **Actual: 701.69M** (StockAnalysis, May 2026)
  - ⚠️ **Share count discrepancy:** Report uses 726M; actual is 701.69M (3.4% lower due to buybacks)
  - Impact: EPS calculations in report are ~3.4% too low for SK Hynix

### Samsung Electronics (005930.KS)
- **Report's CY2026E:** Not explicitly stated
- **Report's share count:** 5.96B → **Actual: 6.65B** (StockAnalysis, May 2026)
  - ⚠️ **MAJOR share count error:** Report uses 5.96B shares; actual is 6.65B (11.6% higher)
  - This means all Samsung EPS figures in the report are **~11.6% too high**
  - Impact on base case: ₩8,200-9,700 → should be ~₩7,350-8,690
  - Impact on bull case: ₩11,100-12,700 → should be ~₩9,950-11,380
  - Impact on bear case: ₩3,700-5,000 → should be ~₩3,315-4,480
- **Note:** Samsung has both common (5.85B) and preferred shares; total outstanding is 6.65B. The report appears to use only common shares.

---

## 3. CY2028 EPS Recalculation

### Micron (MU) — Base Case
**Report's calculation:**
- Revenue: $79.4B, Gross Profit: $39.7B (50%), OpEx: $8.7B (11%), Op Income: $31.0B (39%)
- Interest: -$1.0B, Pre-tax: $30.0B, Tax (15%): -$4.5B, Net Income: $25.5B
- Shares: 1.08B → **EPS: $23.61**

**Verification:**
- $30.0B × (1 - 0.15) = $25.5B ✓
- $25.5B ÷ 1.08B = $23.61 ✓
- **Math checks out**, but share count of 1.08B is reasonable (current 1.13B diluted; dilution may decrease)
- **However**, at current TTM revenue of $58.12B and Street FY2026 consensus of $112B, the $79.4B CY2028 base case looks **conservative** — it implies revenue declining from FY2026 levels, which seems unlikely unless a severe downcycle is assumed.

### SK Hynix — Base Case
**Report's calculation:**
- Net income: ₩6.7T, Shares: 726M → EPS: ₩9,230
- $7.10 at KRW/USD 1,300

**Recalculation with corrected shares (701.69M):**
- ₩6.7T ÷ 701.69M = **₩9,551** (not ₩9,230)
- USD equivalent: $7.35 (at 1,300 KRW/USD)
- **Error magnitude: +3.5%** (EPS understated)

### Samsung — Base Case
**Report's calculation:**
- OP: ₩49-58T, EPS: ₩8,200-9,700 (using 5.96B shares)

**Recalculation with corrected shares (6.65B):**
- ₩49T ÷ 6.65B = **₩7,368** (vs reported ₩8,200)
- ₩58T ÷ 6.65B = **₩8,722** (vs reported ₩9,700)
- **Corrected base EPS range: ₩7,368-8,722** (vs reported ₩8,200-9,700)
- **Error magnitude: ~10-11%** (EPS overstated)

**Samsung probability-weighted EPS:**
- Report: ₩8,000 (~$5.60)
- Corrected: ~₩7,150 (~$5.00) — assuming same OP distribution but with 6.65B shares

---

## 4. P/E Ratio Recalculation (Current Prices vs. Report EPS)

### Using Report's CY2028 Base EPS

| Company | Current Price | Report CY28 Base EPS | P/E (Report) | Corrected CY28 EPS | P/E (Corrected) |
|---|---|---|---|---|---|
| **MU** | $724.66 | $23.61 | 30.7× | $23.61 (no change) | 30.7× |
| **SK Hynix** | ₩1,819,000 | ₩9,230 | 197× | ₩9,551 | 190× |
| **Samsung** | ₩270,500 | ₩8,200-9,700 | 27.9-33.0× | ₩7,368-8,722 | 31.0-36.7× |

**⚠️ CRITICAL FINDING:** The report states SK Hynix CY2028 P/E is "~13×" and Samsung is "~10×". These are wildly inconsistent with current market prices:
- SK Hynix at ₩1,819,000 / ₩9,230 = **197×** (not 13×)
- Samsung at ₩270,500 / ₩8,950 mid = **30.2×** (not 10×)
- MU at $724.66 / $23.61 = **30.7×** (report says ~23×)

**The P/E ratios in the report appear to have been calculated at much lower stock prices** (likely from when the report was drafted, before the massive semiconductor rally). The report's valuation context section for MU mentions "Current price ~$540" and "Market cap ~$540B" — but MU is now at $724.66 with $817B market cap. Similarly, SK Hynix was likely around ₩120,000 when the report cited ~13× P/E, but is now at ₩1,819,000.

**The P/E ratios need to be completely updated to reflect current prices.**

### Updated P/E at Current Prices

| Company | Current Price | CY2026E EPS (Street) | P/E (CY2026E) | CY2028 Base EPS | P/E (CY2028) |
|---|---|---|---|---|---|
| **MU** | $724.66 | $59.18 (FY26) | 12.2× | $23.61 | 30.7× |
| **SK Hynix** | ₩1,819,000 | ₩160,368 | 11.3× | ₩9,551 | 190× |
| **Samsung** | ₩270,500 | ~₩18,000 (est.) | ~15.0× | ₩7,368-8,722 | 31-37× |

**Note:** SK Hynix CY2028 P/E of 190× is clearly wrong — this suggests the CY2028 EPS estimate of ₩9,551 is far too low relative to current earnings power (TTM EPS already ₩106,603). The report's SK Hynix CY2028 EPS appears to assume a severe earnings decline from current levels, which may be the base case cyclical normalization, but the P/E calculation is misleading without context.

---

## 5. P/S Ratio Calculations

### CY2026E P/S

| Company | Market Cap | CY2026E Revenue | P/S (CY2026E) |
|---|---|---|---|
| **MU** | $817B | $112B (Street FY26) | **7.3×** |
| **SK Hynix** | ₩1,382T | ~₩100T (est. from OP forecasts) | **13.8×** |
| **Samsung** | ₩1,725T | ~₩400T (est. from TTM) | **4.3×** |

### CY2028 P/S (Report Base Case)

| Company | Market Cap | CY2028 Revenue (Base) | P/S (CY2028) |
|---|---|---|---|
| **MU** | $817B | $79.4B | **10.3×** |
| **SK Hynix** | ₩1,382T | ₩39.5T | **35.0×** |
| **Samsung** | ₩1,725T | ₩294-318T | **5.4-5.9×** |

**⚠️ Note:** SK Hynix P/S of 35× on CY2028 base case is extremely high, reflecting the market pricing in much higher near-term earnings. The CY2028 base case revenue of ₩39.5T is actually *lower* than current TTM revenue of ₩132T, implying a massive revenue decline — this is the cyclical bear normalization assumption. P/S ratios using these forward estimates are not meaningful without noting the cyclical assumptions.

### Current TTM P/S (for reference)

| Company | Market Cap | TTM Revenue | P/S (TTM) |
|---|---|---|---|
| **MU** | $817B | $58.12B | **14.1×** |
| **SK Hynix** | ₩1,382T | ₩132.08T | **10.5×** |
| **Samsung** | ₩1,725T | ₩388.41T | **4.4×** |

---

## 6. Summary of Errors & Inconsistencies

### 🔴 Critical Errors

| # | Issue | Impact | Recommendation |
|---|---|---|---|
| 1 | **Samsung share count wrong**: Report uses 5.96B; actual is 6.65B | All Samsung EPS figures ~11.6% too high | Recalculate all Samsung EPS with 6.65B shares |
| 2 | **P/E ratios use stale prices**: Report cites ~13× SK Hynix, ~10× Samsung, ~23× MU at prices far below current | Valuation conclusions are misleading | Update all P/E ratios to current market prices |
| 3 | **MU CY2026E revenue ($52B) is far below Street consensus ($112B FY26)** | Revenue bridge appears outdated/incorrect | Update CY2026E to ~$90-100B range |

### 🟡 Moderate Issues

| # | Issue | Impact | Recommendation |
|---|---|---|---|
| 4 | **SK Hynix share count**: Report uses 726M; actual is 701.69M | EPS ~3.4% understated | Update to 701.69M |
| 5 | **MU price in report ($540) vs actual ($724.66)** | Forward P/E section outdated | Update to current price |
| 6 | **SK Hynix CY2028 revenue (₩39.5T) is 70% below current TTM (₩132T)** | P/S and P/E ratios misleading without cyclical context | Add explicit note that base case assumes severe cyclical downturn |

### 🟢 Minor / Confirmatory

| # | Issue | Status |
|---|---|---|
| 7 | MU CY2028 base EPS math ($25.5B ÷ 1.08B = $23.61) | ✅ Correct |
| 8 | MU diluted share count (1.05-1.12B range) | ✅ Reasonable range |
| 9 | Samsung FX assumption (₩1,430/USD) | ✅ Reasonable |
| 10 | SK Hynix USD conversion (₩9,230 ÷ 1,300 = $7.10) | ✅ Correct |

---

## 7. Corrected Key Figures

### Samsung CY2028 EPS (Corrected)

| Scenario | OP Range | EPS (5.96B shares, Report) | EPS (6.65B shares, Corrected) | USD (₩1,430) |
|---|---|---|---|---|
| Bull | ₩66-76T | ₩11,100-12,700 | ₩9,925-11,429 | $6.94-$7.99 |
| Base | ₩49-58T | ₩8,200-9,700 | ₩7,368-8,722 | $5.15-$6.10 |
| Bear | ₩22-30T | ₩3,700-5,000 | ₩3,308-4,511 | $2.31-$3.15 |
| **Prob-weighted** | — | ₩8,000 | **₩7,180** | **$5.02** |

### SK Hynix CY2028 EPS (Corrected)

| Scenario | Net Income | EPS (726M, Report) | EPS (701.69M, Corrected) | USD (₩1,300) |
|---|---|---|---|---|
| Bull | ₩9.6T | ₩13,200 | ₩13,683 | $10.53 |
| Base | ₩6.7T | ₩9,230 | ₩9,551 | $7.35 |
| Bear | ₩3.5T | ₩4,820 | ₩4,988 | $3.84 |

### Updated P/E Ratios at Current Prices (May 15, 2026)

| Company | Price | CY2028 Base EPS (Corrected) | P/E (CY2028) |
|---|---|---|---|
| **MU** | $724.66 | $23.61 | **30.7×** |
| **SK Hynix** | ₩1,819,000 | ₩9,551 | **190×** |
| **Samsung** | ₩270,500 | ₩7,368-8,722 | **31.0-36.7×** |

> **Context:** SK Hynix CY2028 P/E of 190× reflects the base case assumption of a severe cyclical earnings decline from current peak levels. At TTM EPS of ₩106,603, the trailing P/E is 17.1×. The CY2028 forward P/E is only meaningful if one believes the cyclical downturn will be as severe as modeled.

---

*Data sources: StockAnalysis.com (May 15, 2026), SimplyWall.St, Financial News Korea, Eulerpool, company filings*