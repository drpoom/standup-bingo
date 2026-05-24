# P/E Calculations Audit — Independent Verification

**Date:** 2026-05-16  
**Task:** T6.2 — P/E calculations audit  
**Scope:** Independently verify all P/E ratios from T5.1 (SK Hynix), T5.2 (Samsung), T5.3 (Micron)

---

## Audit Methodology

1. **Recalculate every P/E ratio** from raw inputs (share price ÷ consensus EPS) using independent arithmetic
2. **Cross-verify EPS** by computing Net Income ÷ Shares Outstanding and comparing to reported consensus EPS
3. **Verify decreasing sequence** across all three forecast years for each company
4. **Flag any discrepancies** between calculated and reported values

---

## 1. SK Hynix (KRX: 000660)

**Share Price:** ₩1,819,000 (close May 15, 2026)

### P/E Recalculation

| Year | Consensus EPS (₩) | Price (₩) | P/E (Calculated) | P/E (Reported) | Match? |
|------|-------------------|-----------|------------------|----------------|--------|
| 2026E | 301,921 | 1,819,000 | **6.02×** | 6.02× | ✅ |
| 2027E | 385,569 | 1,819,000 | **4.72×** | 4.72× | ✅ |
| 2028E | 385,406 | 1,819,000 | **4.72×** | 4.72× | ✅ |

**Arithmetic verification:**
- 1,819,000 ÷ 301,921 = 6.025 → 6.02× ✅
- 1,819,000 ÷ 385,569 = 4.717 → 4.72× ✅
- 1,819,000 ÷ 385,406 = 4.719 → 4.72× ✅

### EPS Cross-Check (Net Income ÷ Shares)

| Year | Net Income (₩T) | Shares (M) | Implied EPS (₩) | Reported EPS (₩) | Delta |
|------|-----------------|------------|-----------------|-------------------|-------|
| 2026E | 208.45 | 690.4 | 301,907 | 301,921 | −14 (0.005%) |
| 2027E | 266.17 | 690.4 | 385,511 | 385,569 | −58 (0.015%) |
| 2028E | 266.06 | 690.4 | 385,347 | 385,406 | −59 (0.015%) |

**Note:** Minor deltas arise from rounding in the "Net Income (₩M)" figures. The consensus EPS values (301,921 / 385,569 / 385,406) are derived from more precise net income figures and are consistent with MarketScreener/SimplyWall.st. Deltas are immaterial (<0.02%) and do not affect P/E ratios.

### Decreasing Sequence Check

| Transition | P/E Change | Direction |
|------------|-----------|-----------|
| 2026E → 2027E | 6.02× → 4.72× (−21.7%) | ✅ Decreasing |
| 2027E → 2028E | 4.72× → 4.72× (+0.04%) | ⚠️ **Flat** (not strictly decreasing) |

**Root cause:** 2028E net income (₩266.06T) is nearly identical to 2027E (₩266.17T), reflecting analyst expectations that earnings plateau after the HBM-driven surge.

---

## 2. Samsung Electronics (KRX: 005930)

**Share Price:** ₩270,500 (as of 2026-05-16)

### P/E Recalculation

| Year | Consensus EPS (₩) | Price (₩) | P/E (Calculated) | P/E (Reported) | Match? |
|------|-------------------|-----------|------------------|----------------|--------|
| 2026E | 41,508 | 270,500 | **6.52×** | 6.51× | ✅ (rounding) |
| 2027E | 51,295 | 270,500 | **5.27×** | 5.27× | ✅ |
| 2028E | 51,315 | 270,500 | **5.27×** | 5.27× | ✅ |

**Arithmetic verification:**
- 270,500 ÷ 41,508 = 6.5168 → rounds to 6.52× (reported as 6.51× — delta of 0.01× due to rounding convention)
- 270,500 ÷ 51,295 = 5.2733 → 5.27× ✅
- 270,500 ÷ 51,315 = 5.2712 → 5.27× ✅

**Note on 2026E:** The 0.01× difference (6.52 vs 6.51) is a rounding artifact. The exact value is 6.5168×, which rounds to 6.52× with standard rounding. The original report used 6.51×, possibly truncating. This is immaterial.

### EPS Cross-Check (Net Income ÷ Shares)

| Year | Net Income (₩T) | Shares (B) | Implied EPS (₩) | Reported EPS (₩) | Delta |
|------|-----------------|------------|-----------------|-------------------|-------|
| 2026E | 276,031 | 6.65 | 41,508 | 41,508 | 0 ✅ |
| 2027E | 341,110 | 6.65 | 51,295 | 51,295 | 0 ✅ |
| 2028E | 341,245 | 6.65 | 51,315 | 51,315 | 0 ✅ |

**All EPS values match exactly** — consensus EPS is derived directly from Net Income ÷ 6.65B shares.

### Decreasing Sequence Check

| Transition | P/E Change | Direction |
|------------|-----------|-----------|
| 2026E → 2027E | 6.52× → 5.27× (−19.1%) | ✅ Decreasing |
| 2027E → 2028E | 5.27× → 5.27× (−0.04%) | ⚠️ **Flat** (not strictly decreasing) |

**Root cause:** 2028E EPS (₩51,315) is virtually identical to 2027E (₩51,295), a difference of only ₩20 (+0.04%). Consensus projects near-flat earnings growth from 2027E to 2028E.

---

## 3. Micron Technology (NASDAQ: MU)

**Share Price:** $724.66 (close May 15, 2026; after-hours $715.89)

### P/E Recalculation

| Year | Consensus EPS ($) | Price ($) | P/E (Calculated) | P/E (Reported) | Match? |
|------|-------------------|-----------|------------------|----------------|--------|
| FY2026E | 59.18 | 724.66 | **12.25×** | 12.25× | ✅ |
| FY2027E | 101.48 | 724.66 | **7.14×** | 7.14× | ✅ |
| FY2028E | 86.13 | 724.66 | **8.41×** | 8.41× | ✅ |

**Arithmetic verification:**
- 724.66 ÷ 59.18 = 12.245 → 12.25× ✅
- 724.66 ÷ 101.48 = 7.139 → 7.14× ✅
- 724.66 ÷ 86.13 = 8.415 → 8.41× ✅

### Cross-Check with MarketScreener EPS

| Year | MarketScreener EPS ($) | P/E | Reported P/E | Match? |
|------|----------------------|-----|-------------|--------|
| FY2026E | 58.38 | 12.41× | 12.41× | ✅ |
| FY2027E | 100.50 | 7.21× | 7.21× | ✅ |
| FY2028E | 86.13 | 8.41× | 8.41× | ✅ |

**Note:** The "best consensus" uses StockAnalysis/Finnhub EPS ($59.18/$101.48) for FY2026E/FY2027E and MarketScreener ($86.13) for FY2028E. Both sources produce directionally identical P/E profiles.

### Decreasing Sequence Check

| Transition | P/E Change | Direction |
|------------|-----------|-----------|
| FY2026E → FY2027E | 12.25× → 7.14× (−41.7%) | ✅ Decreasing |
| FY2027E → FY2028E | 7.14× → 8.41× (+17.8%) | ❌ **Increasing** |

**Root cause:** FY2028E consensus EPS ($86.13) is ~15% below FY2027E ($101.48), reflecting analyst expectations of earnings decline after the HBM supercycle peak. At constant price, lower EPS → higher P/E.

---

## Overall Audit Verdict

### P/E Ratio Accuracy

| Company | 2026E | 2027E | 2028E | All P/E Confirmed? |
|--------|-------|-------|-------|---------------------|
| SK Hynix | 6.02× ✅ | 4.72× ✅ | 4.72× ✅ | ✅ **YES** |
| Samsung | 6.52× ✅ | 5.27× ✅ | 5.27× ✅ | ✅ **YES** |
| Micron | 12.25× ✅ | 7.14× ✅ | 8.41× ✅ | ✅ **YES** |

**All 9 P/E ratios independently confirmed.** Minor rounding note: Samsung 2026E P/E is 6.5168× (rounds to 6.52×, reported as 6.51× — immaterial 0.01× difference).

### Decreasing Sequence Verification

| Company | P/E Sequence | Strictly Decreasing? | Assessment |
|--------|-------------|---------------------|------------|
| SK Hynix | 6.02 → 4.72 → 4.72 | No (flat at end) | ⚠️ **FLAG** |
| Samsung | 6.52 → 5.27 → 5.27 | No (flat at end) | ⚠️ **FLAG** |
| Micron | 12.25 → 7.14 → 8.41 | No (V-shape) | ❌ **FAIL** |

### Pass/Fail Determination

**Criterion: "All P/E ratios independently confirmed, decreasing sequence verified"**

- ✅ **P/E ratios confirmed:** All 9 P/E ratios independently recalculated and match reported values (within rounding tolerance).
- ⚠️ **SK Hynix decreasing sequence:** P/E decreases 2026E→2027E (−21.7%) but is flat 2027E→2028E (+0.04%). Not strictly decreasing.
- ⚠️ **Samsung decreasing sequence:** P/E decreases 2026E→2027E (−19.1%) but is flat 2027E→2028E (−0.04%). Not strictly decreasing.
- ❌ **Micron decreasing sequence:** P/E decreases FY2026E→FY2027E (−41.7%) but **increases** FY2027E→FY2028E (+17.8%). Not decreasing.

**Overall Verdict: ❌ FAIL** — While all P/E ratios are independently confirmed, the decreasing sequence criterion is NOT met for any of the three companies:
- SK Hynix and Samsung have flat (not decreasing) P/E from 2027E→2028E
- Micron has an increasing P/E from FY2027E→FY2028E

---

## Appendix: Source Data Summary

| Item | SK Hynix | Samsung | Micron |
|------|----------|---------|--------|
| Share Price | ₩1,819,000 | ₩270,500 | $724.66 |
| Price Date | May 15, 2026 | May 16, 2026 | May 15, 2026 |
| EPS Source | MarketScreener/SimplyWall.st | MarketScreener | StockAnalysis/Finnhub + MarketScreener |
| Shares Used | 690.4M | 6.65B | 1.14B (diluted) |
| EPS Basis | KRW (net income/shares) | KRW (net income/shares) | USD (Non-GAAP) |

---

*Audit complete. All P/E calculations verified. Decreasing sequence condition NOT met.*