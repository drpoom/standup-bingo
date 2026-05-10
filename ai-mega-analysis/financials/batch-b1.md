---
batch: "B1"
companies: ["NVDA", "AMD", "AVGO", "MRVL", "INTC", "005930.KS", "000660.KS", "MU", "WDC", "6645.T"]
layers: ["Financial Metrics", "Market Cap", "Revenue", "Gross Margin", "EBITDA", "Net Income", "FCF", "CapEx", "Valuation Multiples", "CAGR", "Moat Score", "AI Exposure", "Key Suppliers"]
created: "2026-05-11"
source: "AI Mega-Analysis"
---

# Batch B1: AI Chips + Memory — Financial Data

**Date compiled:** 2026-05-11  
**Source:** semiconductor-mega-analysis/wiki/ (9 companies) + fresh web research (Kioxia)

---

## 1. NVIDIA (NVDA)

| Metric | Value |
|---|---|
| **Region** | US |
| **Sub-Sector** | Fabless GPU/AI |
| **Market Cap** | $5,230B |
| **Revenue (FY2024)** | $60.9B |
| **Gross Margin** | 72.7% |
| **EBITDA** | $35.0B |
| **Net Income** | $29.8B |
| **FCF** | $23.5B |
| **CapEx** | $6.5B |
| **Net Debt** | -$21.5B (net cash) |
| **P/E** | 176 |
| **EV/EBITDA** | 63 |
| **EV/FCF** | 221 |
| **Revenue CAGR (2024-2026E)** | ~65% |
| **Moat Score** | 5/5 |

**AI Exposure:** Dominant AI training/inference GPU market share (~80%+). CUDA software ecosystem creates unassailable developer network effects. CoWoS/HBM supply constraints are the gating factor. Peak-cycle AI demand driving hypergrowth.

**Key Suppliers:** TSMC (primary foundry, ~90%+), ASML, AMAT, LRCX, TEL, KLA, SUMCO, Shin-Etsu, JSR, ASE, Amkor.

---

## 2. AMD (AMD)

| Metric | Value |
|---|---|
| **Region** | US |
| **Sub-Sector** | Fabless CPU/GPU/AI |
| **Market Cap** | $742B |
| **Revenue (FY2024)** | $25.8B |
| **Gross Margin** | 52.0% |
| **EBITDA** | $6.5B |
| **Net Income** | $1.6B |
| **FCF** | $3.0B |
| **CapEx** | $1.0B |
| **Net Debt** | -$2.5B (net cash) |
| **P/E** | 465 |
| **EV/EBITDA** | 115 |
| **EV/FCF** | 247 |
| **Revenue CAGR (2024-2026E)** | ~25% |
| **Moat Score** | 3/5 |

**AI Exposure:** Distant #2 in AI accelerators behind NVIDIA. MI300X/MI325X gaining traction but no CUDA-equivalent software moat. CoWoS capacity constraint limits ramp vs. NVIDIA.

**Key Suppliers:** TSMC (primary — 5nm/4nm/3nm), Samsung Foundry (secondary), GlobalFoundries (mature nodes), ASE/SPIL, Amkor.

---

## 3. Broadcom (AVGO)

| Metric | Value |
|---|---|
| **Region** | US |
| **Sub-Sector** | Fabless Networking/AI/Custom ASIC |
| **Market Cap** | $2,035B |
| **Revenue (FY2024)** | $51.6B |
| **Gross Margin** | 65.0% |
| **EBITDA** | $30.0B |
| **Net Income** | $5.8B |
| **FCF** | $19.0B |
| **CapEx** | $3.0B |
| **Net Debt** | $53.0B |
| **P/E** | 113 |
| **EV/EBITDA** | 55 |
| **EV/FCF** | 110 |
| **Revenue CAGR (2024-2026E)** | ~18% |
| **Moat Score** | 4/5 |

**AI Exposure:** Custom ASIC business for hyperscalers (Google TPU, Meta) creates sticky relationships. Deep networking/infrastructure IP moat (SerDes, PHY). VMware acquisition adds enterprise software recurring revenue. Developing proprietary 3.5D F2F packaging.

**Key Suppliers:** TSMC (primary — 7nm/5nm/3nm), Samsung Foundry (secondary), GlobalFoundries (mature nodes), ASE, Amkor.

---

## 4. Marvell Technology (MRVL)

| Metric | Value |
|---|---|
| **Region** | US |
| **Sub-Sector** | Data Infrastructure (Fabless) |
| **Market Cap** | $149B |
| **Revenue (FY2024)** | $5.8B |
| **Gross Margin** | 50% |
| **EBITDA** | $1.2B |
| **Net Income** | -$0.2B |
| **FCF** | $0.5B |
| **CapEx** | $0.5B |
| **Net Debt** | $2.0B |
| **P/E** | N/M (negative) |
| **EV/EBITDA** | 60 |
| **EV/FCF** | 151 |
| **Revenue CAGR (2024-2026E)** | ~38% |
| **Moat Score** | 3/5 |

**AI Exposure:** Hyperscaler custom ASIC (XPU) business growing fast. Strong SerDes/Ethernet/custom silicon IP portfolio. 100% fabless with extreme TSMC dependency. CoWoS access is the #1 chokepoint — any allocation squeeze from NVIDIA/AMD directly hits MRVL.

**Key Suppliers:** TSMC (100% — including 2nm platform), ASE (primary OSAT), Amkor, TSMC (CoWoS for custom XPU).

---

## 5. Intel (INTC)

| Metric | Value |
|---|---|
| **Region** | US |
| **Sub-Sector** | Logic Fab IDM |
| **Market Cap** | $628B |
| **Revenue (FY2024)** | $54.0B |
| **Gross Margin** | 42.0% |
| **EBITDA** | $8.0B |
| **Net Income** | -$0.2B |
| **FCF** | -$15.0B |
| **CapEx** | $25.0B |
| **Net Debt** | $25.0B |
| **P/E** | N/M (negative) |
| **EV/EBITDA** | 81 |
| **EV/FCF** | N/M (negative) |
| **Revenue CAGR (2024-2026E)** | ~5% |
| **Moat Score** | 2/5 |

**AI Exposure:** x86 legacy provides installed base but eroding vs. AMD. Foundry business has accumulated ~$30B+ in operating losses. Intel 18A process must succeed for turnaround thesis. High-NA EUV lead adoption is a bet, not a moat. Massive CapEx ($25B/yr) with uncertain returns.

**Key Suppliers:** In-house fabs (Oregon, Arizona, New Mexico, Ireland, Israel; Ohio & Germany under construction); also uses TSMC for competitive tiles. ASML (first High-NA EUV customer), AMAT, LRCX, TEL, KLA, Carl Zeiss.

---

## 6. Samsung Electronics (005930.KS)

| Metric | Value |
|---|---|
| **Region** | KR |
| **Sub-Sector** | Memory/Logic IDM |
| **Market Cap** | $420B |
| **Revenue (FY2024)** | $210.0B |
| **Gross Margin** | 38.0% |
| **EBITDA** | $55.0B |
| **Net Income** | $22.0B |
| **FCF** | $10.0B |
| **CapEx** | $40.0B |
| **Net Debt** | -$35.0B (net cash) |
| **P/E** | 19 |
| **EV/EBITDA** | 7 |
| **EV/FCF** | 39 |
| **Revenue CAGR (2024-2026E)** | ~12% |
| **Moat Score** | 4/5 |

**AI Exposure:** World's largest memory maker (DRAM + NAND). Only company competing with TSMC in advanced foundry (3nm GAA). HBM competition with SK Hynix is key watch item. Foundry business lags TSMC in yield but provides strategic optionality. Vertically integrated from memory to logic to displays.

**Key Suppliers:** In-house fabs (Giheung/Hwaseong/Pyeongtaek, Korea; Xian, China; Taylor, US; Austin, US). ASML (EUV — strategic investor), AMAT, LRCX, TEL, KLA, Nikon.

---

## 7. SK Hynix (000660.KS)

| Metric | Value |
|---|---|
| **Region** | KR |
| **Sub-Sector** | Memory DRAM/NAND |
| **Market Cap** | $160B |
| **Revenue (FY2024)** | $32.0B |
| **Gross Margin** | 42.0% |
| **EBITDA** | $10.0B |
| **Net Income** | $4.0B |
| **FCF** | ~$0B |
| **CapEx** | $12.0B |
| **Net Debt** | -$3.0B (net cash) |
| **P/E** | 40 |
| **EV/EBITDA** | 8 |
| **EV/FCF** | N/M (near zero) |
| **Revenue CAGR (2024-2026E)** | ~31% |
| **Moat Score** | 3/5 |

**AI Exposure:** Dominant HBM market share (HBM3E leader) with NVIDIA as primary customer. >50% of HBM revenue tied to NVIDIA creates customer concentration risk. Proprietary TC NCF packaging for HBM is a differentiator. Memory cyclicality limits moat durability.

**Key Suppliers:** In-house fabs (Icheon, Cheongju, Wuxi); TSMC (HBM base die logic — critical dependency). AMAT, ASML, LRCX, TEL, KLA, Hanwha Semitech (TCB for HBM).

---

## 8. Micron Technology (MU)

| Metric | Value |
|---|---|
| **Region** | US |
| **Sub-Sector** | Memory DRAM/NAND |
| **Market Cap** | $842B |
| **Revenue (FY2024)** | $25.1B |
| **Gross Margin** | 38.0% |
| **EBITDA** | $6.5B |
| **Net Income** | $0.8B |
| **FCF** | -$1.0B |
| **CapEx** | $8.0B |
| **Net Debt** | $5.0B |
| **P/E** | 1,053 |
| **EV/EBITDA** | 130 |
| **EV/FCF** | N/M (negative) |
| **Revenue CAGR (2024-2026E)** | ~38% |
| **Moat Score** | 3/5 |

**AI Exposure:** #3 global DRAM maker in oligopoly with high barriers to entry. HBM capability improving but lags SK Hynix. CHIPS Act funding supports US fab expansion. Deep cyclical trough in FY2024 — FY2026E targets $48B revenue, $14B net income. Classic memory cyclical.

**Key Suppliers:** In-house fabs (Boise, ID; Manassas, VA; Singapore; Hiroshima, Japan; Clay, NY planned). AMAT, ASML, LRCX, TEL, KLA, Advantest.

---

## 9. Western Digital (WDC)

| Metric | Value |
|---|---|
| **Region** | US |
| **Sub-Sector** | Memory (NAND/HDD) |
| **Market Cap** | $165B |
| **Revenue (FY2024)** | $16.5B |
| **Gross Margin** | 30% |
| **EBITDA** | $3.5B |
| **Net Income** | $0.5B |
| **FCF** | $0.0B |
| **CapEx** | $3.0B |
| **Net Debt** | $8.0B |
| **P/E** | 330 |
| **EV/EBITDA** | 47 |
| **EV/FCF** | N/M (near zero) |
| **Revenue CAGR (2024-2026E)** | ~18% |
| **Moat Score** | 2/5 |

**AI Exposure:** NAND/HDD commodity business with limited pricing power. Kioxia JV creates structural dependency (no independent NAND fab). HDD faces secular decline from SSD cannibalization. Cyclical NAND pricing drives extreme earnings volatility. FY2026E net income $3.5B vs $0.5B in FY2024 shows cyclical leverage.

**Key Suppliers:** Kioxia JV (100% of NAND production — Yokkaichi fabs 6/7/8); own HDD assembly (Bangkok, Korat, Penang). AMAT, LRCX, KLA, ASML, TEL, Veeco.

---

## 10. Kioxia Holdings (6645.T / 285A.T)

| Metric | Value |
|---|---|
| **Region** | JP |
| **Sub-Sector** | Memory (NAND) |
| **Market Cap** | ¥24.30T (~$160B) |
| **Revenue (FY2025, Mar 2025)** | ¥1,706.5B (~$11.4B) |
| **Gross Margin** | 33.4% |
| **Operating Margin (Non-GAAP)** | 26.1% |
| **EBITDA (Non-GAAP)** | ¥757.0B (~$5.0B) |
| **Net Income** | ¥272.3B (~$1.8B) |
| **FCF** | ¥252.6B (~$1.7B) |
| **CapEx** | ¥342.1B (~$2.3B) |
| **Net Debt** | ¥831.6B (~$5.5B) |
| **P/E (trailing)** | 145 |
| **P/E (forward)** | 9.0 |
| **EV/EBITDA** | 40 |
| **EV/FCF** | 190 |
| **Revenue CAGR (FY2023→FY2025)** | ~15% (recovery from trough) |
| **Moat Score** | 2/5 |

**AI Exposure:** World's #2 NAND flash maker (formerly Toshiba Memory). BiCS FLASH 3D NAND technology. Key beneficiary of AI-driven storage demand (SSDs for AI servers/data centers). Kioxia-WDC JV operates Yokkaichi fabs — world's largest NAND production site. IPO'd Dec 2024 on TSE Prime Market. HBM-adjacent via packaging partnerships but no direct HBM product. Pure NAND play — leveraged to NAND cycle recovery and AI server SSD demand.

**Key Suppliers:** In-house fabs (Yokkaichi fabs 6/7/8 via JV with WDC; Kitakami fab under construction). AMAT, LRCX (critical for 3D NAND vertical etch), TEL, KLA, ASML.

**Note on FY2024 trough:** FY2024 (ending Mar 2024) was a severe trough — revenue ¥1,076.6B, operating loss ¥252.7B, net loss ¥243.7B. FY2025 (ending Mar 2025) shows dramatic recovery: revenue ¥1,706.5B (+58.5% YoY), operating income ¥444.6B, net income ¥272.3B. Forward P/E of 9 reflects expected normalization.

---

## Summary Comparison Table

| Ticker | Revenue | GM | Net Income | FCF | CapEx | P/E | EV/EBITDA | Moat | AI Exposure |
|---|---|---|---|---|---|---|---|---|---|
| NVDA | $60.9B | 72.7% | $29.8B | $23.5B | $6.5B | 176 | 63 | 5 | Dominant AI GPU |
| AMD | $25.8B | 52.0% | $1.6B | $3.0B | $1.0B | 465 | 115 | 3 | #2 AI accelerator |
| AVGO | $51.6B | 65.0% | $5.8B | $19.0B | $3.0B | 113 | 55 | 4 | Custom ASIC + networking |
| MRVL | $5.8B | 50% | -$0.2B | $0.5B | $0.5B | N/M | 60 | 3 | Custom XPU for hyperscalers |
| INTC | $54.0B | 42.0% | -$0.2B | -$15.0B | $25.0B | N/M | 81 | 2 | Turnaround play, foundry |
| 005930.KS | $210.0B | 38.0% | $22.0B | $10.0B | $40.0B | 19 | 7 | 4 | Memory + foundry optionality |
| 000660.KS | $32.0B | 42.0% | $4.0B | ~$0B | $12.0B | 40 | 8 | 3 | HBM3E leader |
| MU | $25.1B | 38.0% | $0.8B | -$1.0B | $8.0B | 1053 | 130 | 3 | #3 DRAM, HBM ramp |
| WDC | $16.5B | 30% | $0.5B | $0.0B | $3.0B | 330 | 47 | 2 | NAND/HDD cyclical |
| 6645.T | $11.4B | 33.4% | $1.8B | $1.7B | $2.3B | 145/9fwd | 40 | 2 | #2 NAND, AI SSD demand |

---

*Data sources: semiconductor-mega-analysis/wiki/ (9 companies), Kioxia Integrated Report 2025 + stockanalysis.com (Kioxia). All financials are latest available fiscal year. USD equivalents for Japanese/Korean companies use approximate exchange rates.*