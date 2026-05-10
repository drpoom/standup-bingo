# AI Mega-Analysis — Execution Plan

## Phase 0: Setup ✅ COMPLETE
- [x] Directory structure created
- [x] Master company list (70 companies, 10 layers) → universe/master-list.yaml
- [x] Dhandho screening criteria → dhandho/criteria.md
- [x] Coverage report template → coverage/template.md
- [x] Copied 30 wiki files from semiconductor-mega-analysis

## Phase 1: Financial Data (5 subagents parallel)
- B1: L1-L2 (AI Chips + Memory) — 10 companies
- B2: L3-L5 (EDA + Equipment + Foundry) — 10 companies
- B3: L6 (Analog/Power/MCU) — 8 companies
- B4: L7-L9 (Networking + Cloud + Software) — 14 companies
- B5: L10 (Power & Cooling) — 6 companies
- **REUSE wiki data for 29 semiconductor companies already covered**

## Phase 2: Coverage Reports (5 subagents parallel)
- C1-C5: Write coverage for each batch using template

## Phase 3: Screening (serial)
- D1: Aggregate all reports
- D2: Apply Dhandho criteria → narrow to 8-10 candidates
- D3: Deep-dive top 3

## Phase 4: Delivery (serial)
- E1-E3: Write 3 full investment reports
- E4: Send to Telegram

## Batch Assignments

### Batch B1: AI Chips + Memory (10 companies)
NVDA, AMD, AVGO, MRVL, INTC, 005930.KS, 000660.KS, MU, WDC, 6645.T

### Batch B2: EDA + Equipment + Foundry (10 companies)
SNPS, CDNS, ARM, ASML, AMAT, LRCX, KLAC, 8035.T, 6702.T, 4063.T

### Batch B3: Analog/Power/MCU (8 companies)
TXN, ADI, STM, IFX, ON, NXPI, MPWR, 6861.T

### Batch B4: Networking + Cloud + Software (14 companies)
ANET, CIEN, FSLY, MSFT, GOOGL, AMZN, META, ORCL, 9988.HK, PLTR, SNOW, DDOG, MDB, AI, PATH, APLS

### Batch B5: Power & Cooling (6 companies)
VST, CEG, GEV, ETN, VRT, SMID