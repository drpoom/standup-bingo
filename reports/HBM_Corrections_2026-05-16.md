# HBM Investment Report — CORRECTIONS (QA Verification 2026-05-16)

**Original Report Date:** 2026-05-16 | **QA Date:** 2026-05-16

---

## 🔴 Critical Corrections

### 1. Samsung Share Count Error
**Original:** 5.96B shares  
**Corrected:** 6.65B shares (common + preferred)  
**Impact:** All Samsung EPS figures were ~11.6% too high

| Scenario | Original EPS | Corrected EPS |
|----------|--------------|---------------|
| Bull | ₩11,100-12,700 | ₩9,800-11,200 |
| Base | ₩8,200-9,700 | ₩7,368-8,722 |
| Bear | ₩3,700-5,000 | ₩3,270-4,420 |

**Probability-Weighted Corrected EPS:** ~₩6,900 ($5.30) vs original ~₩8,000 ($5.60)

### 2. P/E Ratios — Stale Stock Prices
Report cited P/E using outdated share prices. Current prices (2026-05-16):

| Company | Current Price | Original P/E (2028 Base) | Corrected P/E (2028 Base) |
|---------|---------------|--------------------------|---------------------------|
| SK Hynix | ₩1,819,000 | ~13× | **190×** |
| Samsung | ₩270,500 | ~10× | **31-37×** |
| Micron | $724.66 | ~23× | **31×** |

**Note:** The extreme P/E ratios reflect that 2028 scenarios assume cyclical downturn from 2025 peak margins. Current TTM P/E is more relevant for near-term valuation.

### 3. Micron FY2026E Revenue — Outdated Consensus
**Original:** $52B (used in scenario bridge)  
**Street Consensus:** $112B for FY2026  
**Implication:** Our 2028 scenarios may be conservative if HBM ramp exceeds expectations

---

## 🟡 Moderate Adjustments

### SK Hynix Share Count
**Original:** 726M shares  
**Corrected:** 701.69M shares (buybacks)  
**Impact:** EPS ~3.4% understated  
**Corrected Base EPS:** ₩9,550 ($7.35) vs reported ₩9,230 ($7.10)

### SK Hynix CY2028 Revenue Assumption
**Current TTM Revenue:** ₩132T  
**Report Base Case (2028):** ₩39.5T  
**Assumed Decline:** -70%

This assumes a severe cyclical downturn, which may be overly conservative if:
- HBM TAM reaches $100B by 2028 (vs $85B base case)
- SK Hynix maintains >60% HBM share
- Tariff impacts are mitigated

**Recommendation:** Add "cycle peak" scenario with ₩80-100T 2028 revenue as alternative base case.

---

## ✅ Verified Correct Calculations

- MU CY2028 base EPS: $25.5B net income ÷ 1.08B shares = $23.61 ✓
- SK Hynix USD conversion: ₩9,230 ÷ 1,300 KRW/USD = $7.10 ✓
- MU diluted share count range: 1.05-1.12B (reasonable based on FY2025 trends) ✓

---

## Updated Investment Implications

### Micron (MU) — **UPGRADE Conviction**
- Current price $724.66 vs base case 2028 EPS $23.61 → 31× P/E
- If FY2026E is $112B (not $52B), 2028 base case may be $35-40 EPS
- **Revised Base Case EPS:** $30-35 (implies 20-24× P/E at current price)
- **Action:** Best risk/reward remains, but valuation less compelling at $724

### SK Hynix — **HOLD**
- 190× 2028 P/E reflects extreme cyclical assumptions
- Current TTM P/E more relevant: ~15-20× at peak margins
- **Key Question:** Is 2025 the cycle peak, or does HBM growth extend the supercycle?
- **Action:** Wait for pullback to ₩1.4-1.5M for better entry

### Samsung — **DOWNGRADE to HOLD**
- Corrected EPS reduces probability-weighted value by ~11%
- 31-37× 2028 P/E + foundry drag = less attractive risk/reward
- **Action:** Monitor HBM4 yield data; entry below ₩240,000 more compelling

---

## Revised Valuation Summary (2026-05-16 Prices)

| Company | Price | 2026E P/E | 2028 Base P/E | P/S (TTM) | Verdict |
|---------|-------|-----------|---------------|-----------|---------|
| MU | $724.66 | ~25× | 31× (or 20× if bull) | ~12× | Best R/R but rich |
| SK Hynix | ₩1,819,000 | ~18× | 190× (cyclical) | ~8× | Wait for pullback |
| Samsung | ₩270,500 | ~28× | 31-37× | ~3× | Foundry drag, hold |

---

*QA Verification completed by Warren (subagent) on 2026-05-16. Full methodology in `docs/orchestrations/hbm_analysis/QA_VERIFICATION.md`*
