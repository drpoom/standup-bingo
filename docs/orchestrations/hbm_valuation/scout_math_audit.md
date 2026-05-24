# Math Audit: Revenue & Margin Bridges — EPS Recomputation

**Date:** 2026-05-16  
**Scope:** T4.1 (SK Hynix), T4.2 (Samsung), T4.3 (Micron) EPS bridges  
**Tolerance:** ±0.5% for all cells  
**Auditor:** Scout QA subagent  

---

## Executive Summary

| Company | Verdict | Details |
|---------|---------|---------|
| **SK Hynix** | ✅ PASS | All 3 fiscal years tie correctly. Every cell recomputes within ±0.05%. |
| **Micron** | ✅ PASS | All 3 fiscal years tie correctly across both GAAP-like and Non-GAAP bridges. Max deviation 0.07% (FY2028E EPS rounding). |
| **Samsung** | ⚠️ PASS with note | Bridge arithmetic is internally consistent and ties correctly. One derivation inconsistency flagged (GM% weighted blend vs. stated consolidated GM%), but this does not affect the EPS bridge itself. |

---

## 1. SK Hynix EPS Bridge Audit

### 1.1 Revenue Bridge

| Check | FY2025A | FY2026E | FY2027E | FY2028E |
|-------|---------|---------|---------|---------|
| DRAM + NAND = Revenue | 72.8 + 24.3 = 97.1 ✅ | 159.9 + 45.1 = 205.0 ✅ | 205.2 + 64.8 = 270.0 ✅ | 222.0 + 78.0 = 300.0 ✅ |
| HBM + CommDRAM = DRAM | 29.1 + 43.7 = 72.8 ✅ | 79.9 + 80.0 = 159.9 ✅ | 113.4 + 91.8 = 205.2 ✅ | 111.0 + 111.0 = 222.0 ✅ |
| DRAM % of Revenue | 75.0% ✅ | 78.0% ✅ | 76.0% ✅ | 74.0% ✅ |
| HBM % of DRAM | 40% ✅ | 50% ✅ | 55% ✅ | 50% ✅ |

**Result: All revenue decomposition cells correct. ✅**

### 1.2 Gross Profit Bridge

| Check | FY2025A | FY2026E | FY2027E | FY2028E |
|-------|---------|---------|---------|---------|
| HBM GP (Revenue × GM%) | 29.1 × 65% = 18.9 vs 18.9 ✅ | 79.9 × 73% = 58.3 vs 58.3 ✅ | 113.4 × 72% = 81.6 vs 81.6 ✅ | 111.0 × 70% = 77.7 vs 77.7 ✅ |
| Comm DRAM GP | 43.7 × 55% = 24.0 vs 24.0 ✅ | 80.0 × 65% = 52.0 vs 52.0 ✅ | 91.8 × 60% = 55.1 vs 55.1 ✅ | 111.0 × 57% = 63.3 vs 63.3 ✅ |
| NAND GP | 24.3 × 40% = 9.7 vs 9.7 ✅ | 45.1 × 50% = 22.6 vs 22.6 ✅ | 64.8 × 52% = 33.7 vs 33.7 ✅ | 78.0 × 55% = 42.9 vs 42.9 ✅ |
| Total GP (sum) | 18.9+24.0+9.7 = 52.6 vs 52.6 ✅ | 58.3+52.0+22.6 = 132.9 vs 132.9 ✅ | 81.6+55.1+33.7 = 170.4 vs 170.4 ✅ | 77.7+63.3+42.9 = 183.9 vs 183.9 ✅ |
| Blended GM% | 52.6/97.1 = 54.2% vs 54.2% ✅ | 132.9/205.0 = 64.8% vs 64.8% ✅ | 170.4/270.0 = 63.1% vs 63.1% ✅ | 183.9/300.0 = 61.3% vs 61.3% ✅ |

**Result: All gross profit cells correct. ✅**

### 1.3 EBITDA / EBIT Bridge (Corrected Version)

| Check | FY2025A | FY2026E | FY2027E | FY2028E |
|-------|---------|---------|---------|---------|
| EBIT = GP − SGA&D | 52.6 − 4.9 = 47.7 ✅ | 132.9 − 7.2 = 125.7 ✅ | 170.4 − 10.8 = 159.6 ✅ | 183.9 − 13.5 = 170.4 ✅ |
| EBITDA = EBIT + D&A | 47.7 + 0.5 = 48.2 ✅ | 125.7 + 3.1 = 128.8 ✅ | 159.6 + 8.1 = 167.7 ✅ | 170.4 + 15.0 = 185.4 ✅ |
| Operating Margin | 47.7/97.1 = 49.1% ✅ | 125.7/205.0 = 61.3% ✅ | 159.6/270.0 = 59.1% ✅ | 170.4/300.0 = 56.8% ✅ |
| EBITDA Margin | 48.2/97.1 = 49.6% ✅ | 128.8/205.0 = 62.8% ✅ | 167.7/270.0 = 62.1% ✅ | 185.4/300.0 = 61.8% ✅ |

**Result: All EBITDA/EBIT cells correct. ✅**

### 1.4 Net Income / EPS Bridge

| Check | FY2025A | FY2026E | FY2027E | FY2028E |
|-------|---------|---------|---------|---------|
| EBT = EBIT + Other + Interest | 47.7 + 0 + 0 = 47.7 ✅ | 125.7 + 5.0 + 2.0 = 132.7 ✅ | 159.6 + 3.0 + 3.0 = 165.6 ✅ | 170.4 + 2.0 + 4.0 = 176.4 ✅ |
| Tax = EBT × 25% | 47.7 × 25% = 11.9 ✅ | 132.7 × 25% = 33.2 ✅ | 165.6 × 25% = 41.4 ✅ | 176.4 × 25% = 44.1 ✅ |
| NI = EBT × 75% | 47.7 × 75% = 35.8 ✅ | 132.7 × 75% = 99.5 ✅ | 165.6 × 75% = 124.2 ✅ | 176.4 × 75% = 132.3 ✅ |
| EPS = NI / Shares | 35.8T/690.4M = ₩51,843 ✅ | 99.5T/670.0M = ₩148,507 ✅ | 124.2T/658.5M = ₩188,610 ✅ | 132.3T/645.5M = ₩204,957 ✅ |

**Result: All net income and EPS cells correct. ✅**

### 1.5 SK Hynix Verdict

**✅ PASS** — Every cell in the SK Hynix EPS bridge recomputes correctly within ±0.05% tolerance. The document's own Section 11 tie-out verification is accurate. No material arithmetic errors found.

---

## 2. Micron EPS Bridge Audit

### 2.1 Non-GAAP Bridge (Primary)

| Check | FY2026E | FY2027E | FY2028E |
|-------|---------|---------|---------|
| GP = Rev × GM% | 88.0 × 73.5% = 64.7 vs 64.7 ✅ | 122.0 × 65.0% = 79.3 vs 79.3 ✅ | 150.0 × 61.0% = 91.5 vs 91.5 ✅ |
| EBITDA = GP − OpEx | 64.7 − 5.8 = 58.9 vs 58.9 ✅ | 79.3 − 7.5 = 71.8 vs 71.8 ✅ | 91.5 − 9.5 = 82.0 vs 82.0 ✅ |
| EBIT = EBITDA − D&A | 58.9 − 6.2 = 52.7 vs 52.7 ✅ | 71.8 − 8.5 = 63.3 vs 63.3 ✅ | 82.0 − 9.5 = 72.5 vs 72.5 ✅ |
| EBT = EBIT − Interest | 52.7 − 0.3 = 52.4 vs 52.4 ✅ | 63.3 − 0.3 = 63.0 vs 63.0 ✅ | 72.5 − 0.3 = 72.2 vs 72.2 ✅ |
| Tax = EBT × 20% | 52.4 × 20% = 10.5 vs 10.5 ✅ | 63.0 × 20% = 12.6 vs 12.6 ✅ | 72.2 × 20% = 14.4 vs 14.4 ✅ |
| NI = EBT × 80% | 52.4 × 80% = 41.9 vs 41.9 ✅ | 63.0 × 80% = 50.4 vs 50.4 ✅ | 72.2 × 80% = 57.8 vs 57.8 ✅* |
| EPS = NI / 1.14B | 41.9/1.14 = $36.76 ✅ | 50.4/1.14 = $44.21 ✅ | 57.8/1.14 = $50.70 ✅* |
| EBITDA Margin | 58.9/88.0 = 66.9% ✅ | 71.8/122.0 = 58.9% ✅ | 82.0/150.0 = 54.7% ✅ |
| Operating Margin | 52.7/88.0 = 59.9% ✅ | 63.3/122.0 = 51.9% ✅ | 72.5/150.0 = 48.3% ✅ |

*FY2028E NI: exact calculation is 72.2 × 0.80 = 57.76, stated as 57.8 (0.07% rounding). EPS: 57.76/1.14 = $50.67, stated as $50.70 (0.06% rounding). Both within ±0.5% tolerance.

### 2.2 GAAP-like Bridge (Overview Table)

| Check | FY2026E | FY2027E | FY2028E |
|-------|---------|---------|---------|
| EBT = EBIT − Interest | 52.3 − 0.5 = 51.8 ✅ | 62.3 − 0.5 = 61.8 ✅ | 71.5 − 0.5 = 71.0 ✅ |
| Tax = EBT × 20% | 51.8 × 20% = 10.4 ✅ | 61.8 × 20% = 12.4 ✅ | 71.0 × 20% = 14.2 ✅ |
| NI = EBT × 80% | 51.8 × 80% = 41.4 ✅ | 61.8 × 80% = 49.4 ✅ | 71.0 × 80% = 56.8 ✅ |
| EPS = NI / 1.14B | 41.4/1.14 = $36.32 ✅ | 49.4/1.14 = $43.33 ✅ | 56.8/1.14 = $49.82 ✅ |

**Note:** The GAAP-like and Non-GAAP bridges differ intentionally (GAAP includes higher OpEx/D&A and interest). Both are internally consistent.

### 2.3 Consensus Revenue Bridge

| Check | FY2026E | FY2027E | FY2028E |
|-------|---------|---------|---------|
| GP = Rev × GM% | 109.5 × 73.5% = 80.5 vs 80.5 ✅ | 171.5 × 65.0% = 111.5 vs 111.5 ✅ | 161.3 × 61.0% = 98.4 vs 98.4 ✅ |
| EBITDA = GP − OpEx | 80.5 − 6.0 = 74.5 vs 74.5 ✅ | 111.5 − 8.0 = 103.5 vs 103.5 ✅ | 98.4 − 9.5 = 88.9 vs 88.9 ✅ |
| EBIT = EBITDA − D&A | 74.5 − 6.5 = 68.0 vs 68.0 ✅ | 103.5 − 9.0 = 94.5 vs 94.5 ✅ | 88.9 − 10.0 = 78.9 vs 78.9 ✅ |
| EBT = EBIT − Interest | 68.0 − 0.3 = 67.7 vs 67.7 ✅ | 94.5 − 0.3 = 94.2 vs 94.2 ✅ | 78.9 − 0.3 = 78.6 vs 78.6 ✅ |
| Tax = EBT × 20% | 67.7 × 20% = 13.5 vs 13.5 ✅ | 94.2 × 20% = 18.8 vs 18.8 ✅ | 78.6 × 20% = 15.7 vs 15.7 ✅ |
| NI = EBT × 80% | 67.7 × 80% = 54.2 vs 54.2 ✅ | 94.2 × 80% = 75.4 vs 75.4 ✅ | 78.6 × 80% = 62.9 vs 62.9 ✅ |
| EPS = NI / 1.14B | 54.2/1.14 = $47.54 ✅ | 75.4/1.14 = $66.14 ✅ | 62.9/1.14 = $55.18 ✅ |

### 2.4 Micron Verdict

**✅ PASS** — All three bridge variants (Non-GAAP, GAAP-like, Consensus Revenue) are internally consistent. Every cell recomputes within ±0.5% tolerance. The FY2028E NI/EPS rounding ($57.76 → $57.8, $50.67 → $50.70) is within 0.07%, well within tolerance.

---

## 3. Samsung EPS Bridge Audit

### 3.1 Gross Profit

| Check | 2026E | 2027E | 2028E |
|-------|-------|-------|-------|
| GP = Rev × GM% | 667.8 × 55.0% = 367.3 vs 367.3 ✅ | 803.3 × 47.5% = 381.6 vs 381.6 ✅ | 830.4 × 41.0% = 340.5 vs 340.5 ✅ |

### 3.2 EBITDA / EBIT Bridge

| Check | 2026E | 2027E | 2028E |
|-------|-------|-------|-------|
| EBITDA = GP + D&A + Other | 367.3 + 55.0 + 2.0 = 424.3 vs 424.3 ✅ | 381.6 + 65.0 + 2.5 = 449.1 vs 449.1 ✅ | 340.5 + 72.0 + 2.5 = 415.0 vs 415.0 ✅ |
| EBIT = EBITDA − D&A | 424.3 − 55.0 = 369.3 vs 369.3 ✅ | 449.1 − 65.0 = 384.1 vs 384.1 ✅ | 415.0 − 72.0 = 343.0 vs 343.0 ✅ |
| EBITDA Margin | 424.3/667.8 = 63.5% ✅ | 449.1/803.3 = 55.9% ✅ | 415.0/830.4 = 50.0% ✅ |
| Operating Margin | 369.3/667.8 = 55.3% ✅ | 384.1/803.3 = 47.8% ✅ | 343.0/830.4 = 41.3% ✅ |

### 3.3 Net Income Bridge

| Check | 2026E | 2027E | 2028E |
|-------|-------|-------|-------|
| EBT = EBIT + Net Interest | 369.3 + 5.0 = 374.3 vs 374.3 ✅ | 384.1 + 5.0 = 389.1 vs 389.1 ✅ | 343.0 + 5.0 = 348.0 vs 348.0 ✅ |
| Tax (implied rate) | 98.3/374.3 = 26.26% ✅ | 99.2/389.1 = 25.49% ✅ | 88.7/348.0 = 25.49% ✅ |
| NI = EBT − Tax | 374.3 − 98.3 = 276.0 vs 276.0 ✅ | 389.1 − 99.2 = 289.9 vs 289.9 ✅ | 348.0 − 88.7 = 259.3 vs 259.3 ✅ |

**Note on 2026E tax:** The stated tax rate is ~26.2%, but 374.3 × 26.2% = 98.07, while the stated tax is 98.3. The implied rate is 26.26%. The difference is ₩0.2T (0.2%), within tolerance. The NI calculation uses the stated tax directly (374.3 − 98.3 = 276.0), which is correct.

### 3.4 EPS Calculation

| Check | 2026E | 2027E | 2028E |
|-------|-------|-------|-------|
| Model EPS = Model NI / 6.65B | 276.0/6.65 = ₩41,504 vs ₩41,508 ✅ | 289.9/6.65 = ₩43,594 vs ₩43,594 ✅ | 259.3/6.65 = ₩38,992 vs ₩38,992 ✅ |
| Consensus EPS = Consensus NI / 6.65B | 276.0/6.65 = ₩41,504 vs ₩41,508 ✅ | 341.1/6.65 = ₩51,293 vs ₩51,295 ✅ | 341.2/6.65 = ₩51,308 vs ₩51,315 ✅ |

All within ±0.5% tolerance. ✅

### 3.5 ⚠️ Flagged Issue: GM% Weighted Blend Inconsistency

The document states that consolidated GM% is derived from:
> DS GM% × 61% + non-DS GM% × 39%

However, recomputing this:

| Year | DS GM% | × 61% | + non-DS GM% | × 39% | = Implied | Stated | Delta |
|------|--------|-------|--------------|-------|-----------|--------|-------|
| 2026E | 63.6% | 38.8% | 28% | 10.9% | 49.7% | 55.0% | **5.3pp ❌** |
| 2027E | 53.6% | 32.7% | 27% | 10.5% | 43.2% | 47.5% | **4.3pp ❌** |
| 2028E | 45.8% | 27.9% | 26% | 10.1% | 38.1% | 41.0% | **2.9pp ❌** |

**Root cause:** The stated non-DS GM% of ~25–30% (for Samsung's MX/HD/Harman divisions) is plausible for consumer electronics, but does not reconcile with the stated consolidated GM% of 55%/47.5%/41%. The implied non-DS GM% would need to be ~41–66% to match, which is unrealistic for Samsung's non-DS divisions.

**Impact on EPS bridge:** **None.** The EPS bridge uses the consolidated GM% (55%/47.5%/41%) directly to compute GP from Revenue. The GM% derivation is an explanatory note, not an input to the bridge. The bridge arithmetic is internally consistent regardless of this derivation inconsistency.

**Severity:** Medium. The derivation explanation is misleading, but the bridge itself is correct. Recommend updating the non-DS GM% assumption or the DS revenue share to make the derivation consistent with the stated consolidated GM%.

### 3.6 Samsung Verdict

**⚠️ PASS with note** — All bridge arithmetic ties correctly. Every cell in the Revenue → EBITDA → EBIT → Net Income → EPS chain recomputes within ±0.5% tolerance. One medium-severity issue flagged: the GM% weighted blend derivation (DS% × DS_GM + non-DS% × non-DS_GM) does not reconcile with the stated consolidated GM%. This is a documentation/explanation issue, not a bridge arithmetic error.

---

## 4. Cross-Company Summary

| Metric | SK Hynix | Micron | Samsung |
|--------|----------|--------|---------|
| Revenue decomposition | ✅ | ✅ | ✅ |
| Gross profit bridge | ✅ | ✅ | ✅ |
| EBITDA/EBIT bridge | ✅ | ✅ | ✅ |
| Net income bridge | ✅ | ✅ | ✅ |
| EPS calculation | ✅ | ✅ | ✅ |
| Margin % consistency | ✅ | ✅ | ⚠️ GM% derivation |
| Max cell deviation | 0.05% | 0.07% | 0.2% (tax rounding) |
| Overall verdict | **PASS** | **PASS** | **PASS w/ note** |

---

## 5. Findings Summary

### Material Errors Found: **None**

No material arithmetic errors (≥0.5%) were found in any of the three EPS bridges. All cells recompute correctly within the specified tolerance.

### Minor Issues (within tolerance):

1. **Samsung 2026E tax rounding:** Stated tax ₩98.3T implies a 26.26% rate vs. the stated ~26.2%. Difference of ₩0.2T (0.2%), within tolerance.

2. **Micron FY2028E NI/EPS rounding:** 72.2 × 0.80 = 57.76, stated as 57.8 (0.07% rounding). EPS: 57.76/1.14 = $50.67, stated as $50.70 (0.06% rounding). Both within tolerance.

3. **SK Hynix FY2025A EPS:** 35.775T/690.4M = ₩51,818, stated as ₩51,843 (0.05% difference). Within tolerance.

### Documentation Issues (not arithmetic errors):

1. **Samsung GM% derivation:** The stated DS/non-DS weighted blend does not reconcile with the consolidated GM%. The consolidated GM% (55%/47.5%/41%) is used directly in the bridge and is internally consistent, but the explanatory text claiming it derives from "DS 63.6% × 61% + non-DS 28% × 39% ≈ 55%" is incorrect (actual result: 49.8%). This should be corrected or the non-DS GM% assumption should be updated.

2. **Micron dual bridge presentation:** The document presents both a "GAAP-like" overview table and a "Non-GAAP" detailed bridge with different OpEx, D&A, and interest figures. This is intentional (GAAP vs. Non-GAAP adjustments) and both are internally consistent, but the document could benefit from a clearer reconciliation between the two.

---

**Audit complete. All three EPS bridges pass the ±0.5% tolerance test.**