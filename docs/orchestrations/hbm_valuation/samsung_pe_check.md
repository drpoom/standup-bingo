# Samsung Electronics — P/E Check 2026E / 2027E / 2028E

**Date:** 2026-05-16  
**Task:** T5.2 — Samsung P/E verification  
**Current Price:** ₩270,500 (as of 2026-05-16)

---

## P/E Calculation

| Metric | 2026E | 2027E | 2028E |
|--------|-------|-------|-------|
| **Consensus EPS (₩)** | 41,508 | 51,295 | 51,315 |
| **Current Price (₩)** | 270,500 | 270,500 | 270,500 |
| **P/E Ratio** | **6.51×** | **5.27×** | **5.27×** |

**Calculation:**
- 2026E P/E = 270,500 ÷ 41,508 = 6.51×
- 2027E P/E = 270,500 ÷ 51,295 = 5.27×
- 2028E P/E = 270,500 ÷ 51,315 = 5.27×

---

## Verification

### Condition 1: All P/E < 10×
| Year | P/E | < 10×? |
|------|-----|--------|
| 2026E | 6.51× | ✅ YES |
| 2027E | 5.27× | ✅ YES |
| 2028E | 5.27× | ✅ YES |

**Result: ✅ PASS** — All P/E ratios are well below 10×.

### Condition 2: P/E Decreasing Year-Over-Year
| Transition | P/E Change | Decreasing? |
|------------|-----------|-------------|
| 2026E → 2027E | 6.51× → 5.27× (−19.0%) | ✅ YES |
| 2027E → 2028E | 5.27× → 5.27× (−0.04%) | ⚠️ FLAG — ESSENTIALLY FLAT |

**Result: ⚠️ FLAG** — P/E is NOT strictly decreasing from 2027E to 2028E. The 2027E→2028E P/E is essentially flat (5.27× → 5.27×) because consensus EPS barely grows (₩51,295 → ₩51,315, +0.04%). This means the P/E is not decreasing year-over-year across all three years.

---

## ⚠️ FLAG: 2027E→2028E P/E Not Decreasing

**Root cause:** Consensus projects near-flat EPS growth from 2027E to 2028E (₩51,295 → ₩51,315, +₩20 or +0.04%). At a constant share price, this produces a flat P/E trajectory rather than a declining one.

**Context:** This reflects analyst expectations that Samsung's earnings plateau after the 2027 peak, with the memory supercycle normalizing. The 2028E consensus EPS of ₩51,315 is virtually identical to 2027E's ₩51,295, suggesting analysts see limited earnings growth beyond 2027.

**Implication for valuation:** While all P/E ratios are comfortably below 10× (indicating deep value), the lack of a declining P/E trajectory from 2027E→2028E means the "P/E decreasing year-over-year" criterion is NOT met in full. The P/E profile is: 6.51× → 5.27× → 5.27× (decline then flat).

---

## Overall Assessment

| Criterion | Status |
|-----------|--------|
| All P/E < 10× | ✅ PASS |
| P/E decreasing YoY | ⚠️ FLAG — 2027E→2028E flat, not decreasing |

**Verdict: CONDITIONAL PASS with FLAG** — All P/E ratios are well below 10× (deep value territory), but the P/E is not strictly decreasing across all year-over-year transitions. The 2027E→2028E P/E is flat at 5.27× due to near-zero consensus EPS growth.

---

## Data Sources

- **EPS:** Consensus EPS from MarketScreener / StockAnalysis (see consensus_eps.md and samsung_eps_bridge.md)
- **Price:** ₩270,500 (Samsung Electronics common stock, KRX: 005930, as of 2026-05-16)
- **Shares:** ~6.65B total (common + preferred)

---

*Task T5.2 complete. P/E calculated, verification stated. ⚠️ FLAG on 2027E→2028E P/E not decreasing.*