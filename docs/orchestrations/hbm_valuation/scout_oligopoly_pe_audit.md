# Micron P/E Audit: Oligopoly Thesis Revision

**Date**: 2026-05-17  
**Auditor**: Scout (subagent)  
**Source file**: `oligopoly_thesis_revision.md`  
**Price used**: $724.66

---

## 1. Finding: Framework Mixing in Section 4 P/E Table

### The Problem

The **Revised P/E Analysis (Oligopoly Framework)** table in Section 4 reports:

| Company | 2026E P/E | 2027E P/E | 2028E P/E |
|---------|----------|----------|----------|
| Micron | 12.25× | 7.14× | 12.0× |

These three P/E values are derived from **two different EPS frameworks**:

| Year | EPS Used | Source Framework | Implied EPS |
|------|---------|-----------------|-------------|
| 2026E | Consensus $59.18 | **Cyclical** (Street consensus) | $724.66 / 12.25× = $59.16 |
| 2027E | Consensus $101.48 | **Cyclical** (Street consensus) | $724.66 / 7.14× = $101.49 |
| 2028E | Oligopoly $60.53 | **Oligopoly** (capacity model) | $724.66 / 12.0× = $60.39 |

**2026E and 2027E use consensus EPS** (the same values as the "Previous P/E Analysis / Cyclical Framework" table). **2028E switches to oligopoly EPS** ($60.53 from the capacity model). This makes the 2028E P/E appear anomalously high relative to 2027E, creating a false "still elevated ⚠️" signal.

### Why This Matters

- Consensus 2027E EPS ($101.48) reflects a **supercycle peak** — the highest earnings year
- Oligopoly 2028E EPS ($60.53) is a **capacity-model base case** — structurally lower than consensus
- Comparing P/E from consensus peak earnings (7.14×) to capacity-model base earnings (12.0×) is apples-to-oranges
- The correct oligopoly 2028E P/E trajectory should show **monotonically decreasing P/E** (since oligopoly EPS grows every year), consistent with the thesis narrative

---

## 2. Reported vs. Recalculated P/E Verification

### Section 2: Micron FY2028E Scenario Table — ✅ All Correct

| Scenario | Reported EPS | Reported P/E | Recalc P/E | Match? |
|----------|-------------|-------------|-----------|--------|
| Previous Bear | $33.33 | 21.7× | 21.74× | ✅ |
| New Bear | $49.12 | 14.7× | 14.75× | ✅ |
| Previous Base | $50.70 | 14.3× | 14.29× | ✅ |
| **New Base** | **$60.53** | **12.0×** | **11.97×** | ✅ |
| Previous Bull | $67.54 | 10.7× | 10.73× | ✅ |
| New Bull | $75.44 | 9.6× | 9.61× | ✅ |

All P/E calculations within the FY2028E scenario table are internally consistent. P/E = Price / EPS checks out for all six scenarios.

### Section 4: Cyclical P/E Table — ✅ Internally Consistent

| Year | EPS (Consensus) | Reported P/E | Recalc P/E | Match? |
|------|-----------------|-------------|-----------|--------|
| FY2026E | $59.18 | 12.25× | 12.25× | ✅ |
| FY2027E | $101.48 | 7.14× | 7.14× | ✅ |
| FY2028E | $86.13 | 8.41× | 8.41× | ✅ |

### Section 4: Oligopoly P/E Table — ❌ Framework Mixing

| Year | EPS Used | Framework | Reported P/E | Recalc P/E | Match? |
|------|---------|-----------|-------------|-----------|--------|
| FY2026E | $59.18 | Consensus (cyclical) | 12.25× | 12.25× | ✅ (math) |
| FY2027E | $101.48 | Consensus (cyclical) | 7.14× | 7.14× | ✅ (math) |
| FY2028E | $60.53 | Oligopoly (capacity) | 12.0× | 11.97× | ✅ (math) |

The math is correct, but the **EPS series is inconsistent** — two different frameworks are mixed in one row.

---

## 3. Trajectory Consistency Check

### Rule: If EPS grows YoY at a fixed price, P/E must decrease.

### Cyclical Framework (Consensus EPS)

| Transition | EPS Change | P/E Change | Consistent? |
|-----------|-----------|-----------|------------|
| FY2026E→FY2027E | $59.18 → $101.48 (↑71%) | 12.25× → 7.14× (↓) | ✅ |
| FY2027E→FY2028E | $101.48 → $86.13 (↓15%) | 7.14× → 8.41× (↑) | ✅ (EPS fell → P/E rose) |

Cyclical framework is internally consistent. The P/E increase from 7.14× to 8.41× correctly reflects earnings decline — this is the "value trap" signal the report identifies.

### Oligopoly Framework (Capacity-Model EPS)

| Transition | EPS Change | P/E Change | Consistent? |
|-----------|-----------|-----------|------------|
| FY2026E→FY2027E | $36.76 → $50.80 (↑38%) | 19.71× → 14.26× (↓) | ✅ |
| FY2027E→FY2028E | $50.80 → $60.53 (↑19%) | 14.26× → 11.97× (↓) | ✅ |

**Oligopoly EPS grows monotonically, so P/E decreases monotonically.** This is the correct "growth stock" signal — exactly what the thesis argues.

### Mixed Framework (As Currently in Report)

| Transition | EPS Change | P/E Change | Consistent? |
|-----------|-----------|-----------|------------|
| FY2026E→FY2027E | $59.18 → $101.48 (↑71%) | 12.25× → 7.14× (↓) | ✅ |
| FY2027E→FY2028E | $101.48 → $60.53 (↓40%) | 7.14× → 12.0× (↑) | ❌ **MISLEADING** |

The apparent P/E increase from 7.14× to 12.0× is an artifact of switching from consensus EPS to capacity-model EPS, NOT a real deterioration. The 2027E→2028E transition looks like earnings collapse because the two EPS figures come from different models.

---

## 4. Root Cause

The oligopoly P/E table in Section 4 reuses the **cyclical framework P/E values for 2026E and 2027E** (12.25× and 7.14×) because no oligopoly-specific EPS was provided for those years in the P/E comparison table. The oligopoly EPS bridge (Section 3) only provides:

- FY2026E: $36.76 (unchanged from previous — same as capacity model)
- FY2027E: $50.80 (oligopoly uplift from $44.21)
- FY2028E: $60.53 (oligopoly uplift from $50.70)

But the P/E table uses consensus EPS ($59.18 / $101.48) for 2026E/2027E instead of the oligopoly EPS ($36.76 / $50.80), then switches to oligopoly EPS ($60.53) for 2028E.

**The report also lacks oligopoly EPS figures for 2026E and 2027E in the P/E comparison table** — it only provides them in the EPS impact section. The 2026E oligopoly EPS is unchanged ($36.76 = previous base), and 2027E oligopoly EPS is $50.80, but these were never translated into P/E ratios in the main comparison.

---

## 5. Corrected P/E Tables

### Corrected Table A: Pure Oligopoly Framework (Recommended)

Using capacity-model-derived oligopoly EPS for all three years:

| Year | Oligopoly EPS | P/E at $724.66 | YoY P/E Change | Trajectory |
|------|-------------|---------------|----------------|------------|
| FY2026E | $36.76 | 19.71× | — | — |
| FY2027E | $50.80 | 14.26× | ↓28% | ✅ Decreasing |
| FY2028E | $60.53 | 11.97× | ↓16% | ✅ Decreasing |

**Signal: Monotonically decreasing P/E → growth stock pattern, not cyclical peak.** This is consistent with the oligopoly thesis.

### Corrected Table B: Pure Cyclical Framework (For Comparison)

Using consensus EPS for all three years:

| Year | Consensus EPS | P/E at $724.66 | YoY P/E Change | Trajectory |
|------|-------------|---------------|----------------|------------|
| FY2026E | $59.18 | 12.25× | — | — |
| FY2027E | $101.48 | 7.14× | ↓42% | ✅ Decreasing |
| FY2028E | $86.13 | 8.41× | ↑18% | ❌ Increasing (earnings decline) |

**Signal: P/E increases in 2028E → cyclical peak / value trap pattern.** This correctly reflects consensus expectations of earnings decline.

### Corrected Table C: Side-by-Side Comparison

| Year | Cyclical P/E | Oligopoly P/E | Delta |
|------|-------------|-------------|-------|
| FY2026E | 12.25× | 19.71× | +7.46× |
| FY2027E | 7.14× | 14.26× | +7.12× |
| FY2028E | 8.41× | 11.97× | +3.56× |

> Note: Oligopoly P/E is higher in all years because capacity-model EPS is lower than consensus EPS. The key insight is the **trajectory**: cyclical P/E rises in 2028E (value trap), oligopoly P/E falls every year (growth signal).

---

## 6. Recommended Fix for `oligopoly_thesis_revision.md`

1. **Section 4, Oligopoly P/E Table**: Replace Micron row with oligopoly EPS-derived P/E:
   - Change from: `Micron | 12.25× | 7.14× | 12.0× | Still elevated ⚠️`
   - Change to: `Micron | 19.71× | 14.26× | 11.97× | Decreasing ✅`

2. **Add a note** explaining that oligopoly P/E starts higher (because capacity-model EPS is lower than consensus) but decreases monotonically, which is the growth-stock signal.

3. **Alternatively**, present both frameworks side-by-side (as in Corrected Table C above) to make the comparison explicit rather than mixing frameworks.

---

## 7. Summary

| Item | Status |
|------|--------|
| FY2028E scenario P/E calculations (Section 2) | ✅ All correct |
| Cyclical P/E table (Section 4) | ✅ Correct |
| Oligopoly P/E table (Section 4) | ❌ **Framework mixing**: 2026E/2027E use consensus EPS, 2028E uses oligopoly EPS |
| EPS trajectory consistency (oligopoly) | ✅ EPS grows monotonically → P/E should decrease monotonically |
| Reported "still elevated" signal for Micron | ❌ **Artifact** of mixing frameworks; correct oligopoly P/E trajectory is monotonically decreasing |
| Corrected Micron oligopoly P/E | 19.71× → 14.26× → 11.97× (decreasing ✅) |

**Bottom line**: The Micron "still elevated ⚠️" flag in the oligopoly P/E table is a false signal caused by mixing consensus EPS (2026-2027) with capacity-model EPS (2028). Under a consistent oligopoly framework, Micron's P/E trajectory is monotonically decreasing — the same "growth stock" pattern shown by SK Hynix and Samsung.