# Sector Screener Skill — Deep Industry Analysis

**Version:** 1.0 (2026-05-10)
**Owner:** Warren 🦅 (primary), Archie 📐 (planning), Mickey 🐕 (orchestration)
**Model:** `glm-5.1:cloud` @ temperature 0.1 (Warren/Archie), `qwen3.5:cloud` @ 0.4 (Mickey)
**Thinking:** medium (deep fundamental analysis)

---

## Purpose

Systematic sector-wide deep dive: map universe, screen top candidates, analyze supplier chains, collect financials, index to wiki, produce coverage reports, and identify Dhandho-style hidden gems.

**Trigger:** User wants comprehensive sector analysis (e.g., "analyze all semiconductor stocks + suppliers, find 3 best Dhandho picks")

---

## ⚡ Task Decomposition Protocol (MANDATORY)

**Per AGENTS.md:** Complex tasks (≥1 min, multi-turn) MUST be decomposed into atomic 1-2 min subtasks.

### Sector Screener Standard Workflow

| Phase | Step | Subtask | Duration | Parallel OK? | Owner |
|-------|------|---------|----------|--------------|-------|
| **1** | 1.1 | **Universe Mapping — US** — List all US-listed semiconductor stocks (design, fab, equipment, materials, IP) | 1-2 min | No | Archie |
| **1** | 1.2 | **Universe Mapping — Europe** — List EU/UK semiconductor stocks (Infineon, ASM, etc.) | 1-2 min | Yes (after 1.1) | Archie |
| **1** | 1.3 | **Universe Mapping — Asia** — List Japan, Korea, Taiwan, China semi stocks (TSM, Samsung, SK Hynix, etc.) | 1-2 min | Yes (after 1.1) | Archie |
| **1** | 1.4 | **Consolidate Universe** — Merge lists, remove duplicates, assign tickers/exchanges | 1-2 min | No (needs 1.1-1.3) | Archie |
| **2** | 2.1 | **Screening Criteria** — Define filters (market cap, revenue, strategic importance, moat potential) | 1-2 min | No | Warren |
| **2** | 2.2 | **Top 30 Selection** — Apply filters, rank, select top 30 for deep analysis | 1-2 min | No (needs 2.1) | Warren |
| **3** | 3.1-3.30 | **Supplier Chain Mapping — Batch 1-10** — For each of 30 stocks: identify equipment, materials, IP, OSAT suppliers | 1-2 min each | Yes (batched 5-10 at a time) | Warren |
| **4** | 4.1-4.N | **Financial Data Collection — Batches** — 2024-2026 revenue, margins, FCF, capex for all 30 + key suppliers | 1-2 min per batch | Yes (batched 5-10 at a time) | Warren |
| **5** | 5.1-5.N | **Wiki Indexing — Batches** — Create index.md, inject frontmatter, update WATCHLIST.md, git commit | 1-2 min per batch | No (serialize git commits) | Warren |
| **6** | 6.1-6.N | **Initial Coverage Reports — Batches** — 1-page thesis per stock (exec summary, moat, bull/base/bear, valuation) | 1-2 min per batch | Yes (batched 5-10 at a time) | Warren |
| **7** | 7.1 | **Dhandho Candidate Screening** — Screen for: low valuation + high growth + misunderstood cyclicality | 1-2 min | No (needs phase 6) | Warren |
| **7** | 7.2 | **Deep Dive — Candidate 1** — Full thesis with Porter's 5 Forces, scenario analysis, invalidation | 1-2 min | No | Warren |
| **7** | 7.3 | **Deep Dive — Candidate 2** — Full thesis with Porter's 5 Forces, scenario analysis, invalidation | 1-2 min | No | Warren |
| **7** | 7.4 | **Deep Dive — Candidate 3** — Full thesis with Porter's 5 Forces, scenario analysis, invalidation | 1-2 min | No | Warren |
| **7** | 7.5 | **Final Selection & Report** — Compare 3 candidates, select final picks, deliver to user | 1-2 min | No | Warren |

**Batching Rules:**
- **Parallel batches:** Steps 3-6 can run 5-10 stocks in parallel per batch
- **Serialized steps:** Git commits (phase 5) must be serialized to avoid conflicts
- **Dependencies:** Each phase depends on previous phase completion

---

## 📊 Dhandho Selection Criteria

**"Dhandho Style" = Low risk + High upside + Misunderstood business**

| Criterion | Threshold | Rationale |
|-----------|-----------|-----------|
| **Valuation** | P/E <15x or P/B <2x or EV/EBITDA <10x | Margin of safety |
| **Growth** | Revenue CAGR >20% (3-5yr projected) | High upside potential |
| **Misunderstanding** | Market treats as cyclical, but structural growth exists | Dhandho asymmetry |
| **Moat** | Narrow or widening (not none/narrowing) | Durable advantage |
| **Balance Sheet** | Net cash or Net Debt/EBITDA <2x | Survives downturns |
| **Catalyst** | Clear 1-3yr catalyst for re-rating | Value realization |

**Red Flags (automatic reject):**
- Declining ROIC trend (3+ years)
- Net Debt/EBITDA >3x without clear paydown path
- Moat narrowing (competitive losses, margin compression)
- Management integrity issues

---

## 🌍 Semiconductor Sector Taxonomy

### Sub-Sectors to Map

| Sub-Sector | Examples | Key Metrics |
|------------|----------|-------------|
| **Logic Fabs (Foundries)** | TSM, UMC, GlobalFoundries, SMIC | Capacity utilization, node leadership, capex intensity |
| **Memory Fabs (IDM)** | Samsung, SK Hynix, MU, WDC/SNDK, Kioxia | Bit growth, pricing, inventory days, node transitions |
| **Fabless Design** | NVDA, AMD, AVGO, QCOM, MRVL, MPWR | Design wins, TAM expansion, gross margin % |
| **Equipment** | ASML, AMAT, LRCX, KLAC, TEL, DIS | Order backlog, book-to-bill, service revenue % |
| **Materials** | Shin-Etsu, SUMCO, Posco, Entegris, AMAT | Wafer capacity, pricing power, customer concentration |
| **IP/EDA** | ARM, SNPS, CDNS | Royalty growth, design starts, EDA tool adoption |
| **OSAT (Outsourced Assembly/Test)** | ASE, Amkor, SPIL, JCET | Advanced packaging capacity, SiP/Chiplet capabilities |
| **Analog/Power** | TXN, ADI, STM, INFN | Product breadth, automotive exposure, margin stability |
| **Sensors/MEMS** | STMicro, Bosch (private), Himax | Automotive/industrial mix, unit growth |

---

## 📁 Wiki Indexing Protocol

**Every stock analyzed must be indexed in the investments wiki:**

### File Structure
```
investments/
├── stocks/
│   ├── <TICKER>/
│   │   ├── index.md (file table + key stats)
│   │   ├── fundamentals.yaml (structured financials)
│   │   ├── 10-K/ (annual reports)
│   │   ├── 10-Q/ (quarterly reports)
│   │   ├── presentations/
│   │   └── transcripts/
│   └── ...
├── theses/
│   ├── <ticker>-<date>.md (initial coverage + updates)
│   └── sector-deep-dives/
│       └── semiconductors-2026-05.md
├── indices/
│   ├── stock_index.yaml (global index)
│   └── sector_indices/
│       └── semiconductors.yaml
└── WATCHLIST.md
```

### Automated Workflow (Per Stock)

1. **Convert** PDF/HTML → Markdown (`markitdown`)
2. **Inject** YAML frontmatter (`inject_frontmatter.py`)
3. **Rebuild** stock index (`rebuild_index.py --ticker <TICKER>`)
4. **Update** WATCHLIST.md if new ticker
5. **Git commit** with message: "Add <TICKER> to semi sector analysis"

### Sector Index File

Create/update `indices/sector_indices/semiconductors.yaml`:
```yaml
sector: Semiconductors
last_updated: 2026-05-10
subsectors:
  - name: Logic Fabs
    stocks: [TSM, UMC, GFS, SMIC]
  - name: Memory
    stocks: [005930.KS, 000660.KS, MU, WDC, SNDK]
  - name: Equipment
    stocks: [ASML, AMAT, LRCX, KLAC, TEL]
  # ... etc
top_30: [list of top 30 tickers]
suppliers_mapped: [list of supplier tickers]
coverage_status:
  <TICKER>: { status: complete|in-progress|pending, report_date: YYYY-MM-DD }
```

---

## 📝 Output Format (Final Deliverable)

```markdown
# Sector Deep Dive: Semiconductors

**Date:** YYYY-MM-DD
**Analyst:** Warren + Team
**Scope:** 30 stocks + supplier chain → 3 Dhandho picks

---

## Executive Summary

[2-3 sentences: sector dynamics, key findings, top 3 picks]

---

## Sector Map

| Sub-Sector | # Stocks | Top Players | Growth Driver |
|------------|----------|-------------|---------------|
| Logic Fabs | X | TSM, UMC | AI chips, advanced nodes |
| Memory | X | Samsung, SK Hynix, MU | HBM, AI storage |
| ... | ... | ... | ... |

---

## Top 30 Universe

[Table with ticker, name, exchange, market cap, sub-sector, valuation, verdict]

---

## Supplier Chain Map

[Diagram or table showing relationships: Top 30 → their suppliers]

---

## Dhandho Picks (Top 3)

### #1: $TICKER (Company Name)
**Verdict:** STRONG BUY
**Current Price:** $X
**Target Intrinsic Value:** $Y (50%+ upside)
**Margin of Safety:** High

**Why the Market is Wrong:**
[Explain misunderstanding: cyclical vs structural, temporary headwinds, etc.]

**Catalyst:** [What unlocks value + when]

**Full Thesis:** [Link to detailed report]

### #2: $TICKER (Company Name)
[...]

### #3: $TICKER (Company Name)
[...]

---

## Appendix: All Coverage Reports

[Links to all 30+ initial coverage reports in wiki]
```

---

## 🛠️ Tools & Scripts

### Web Search Patterns
```
- "semiconductor stocks list US Europe Asia 2026"
- "<TICKER> investor relations 10-K 2024 2025 2026"
- "<TICKER> suppliers equipment materials"
- "semiconductor equipment manufacturers list"
- "semiconductor materials suppliers Japan Korea"
```

### Wiki Scripts
```bash
# Convert filing
markitdown <input-file> > investments/stocks/<TICKER>/<type>/<filename>.md

# Inject frontmatter
python3 investments/scripts/inject_frontmatter.py --file <path> --ticker <TICKER> --form-type <type> --fiscal-year <YYYY>

# Rebuild index
python3 investments/scripts/rebuild_index.py --ticker <TICKER>

# Sector index
python3 investments/scripts/rebuild_index.py --sector semiconductors
```

---

## ⚠️ Guardrails

1. **No price targets** — Intrinsic value ranges, not specific targets
2. **No timing predictions** — Catalysts are "what + when range", not exact dates
3. **Batch sizing** — Never process >10 stocks in parallel (timeout risk)
4. **Git serialization** — Commits must be serialized, not parallel
5. **Data freshness** — Flag if data is stale (>6 months old)
6. **Exchange awareness** — Note currency, trading hours, settlement for non-US stocks

---

## Integration

**Pipeline:** Sector analysis workflows
**Team Role:** 
- **Archie:** Phase 1-2 planning (universe mapping, screening criteria)
- **Warren:** Phase 3-7 execution (supplier mapping, financials, reports, picks)
- **Mickey:** Orchestration (spawn batches, track progress, serialize commits)
**Handoff to Mickey:** All reports saved to wiki → final 3 picks delivered to user → MEMORY.md updated

---

## Success Metrics

1. **Coverage completeness:** 100% of top 30 + key suppliers indexed
2. **Wiki integrity:** All files have valid frontmatter, index updated
3. **Dhandho quality:** Picks meet all 6 criteria (valuation, growth, misunderstanding, moat, balance sheet, catalyst)
4. **Atomic execution:** No timeout failures, all batches complete
5. **User delivery:** Clear final report with 3 actionable picks

---

## Lessons Learned (TBD)

[To be updated after first run]
