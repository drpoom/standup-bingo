# PHASE 3B: Supplier Chain Mapping — Batch B

> **Last updated:** 2026-05-10  
> **Companies covered:** MU, 000660.KS (SK Hynix), INTC, QCOM, TXN, MRVL

---

## 1. MU (Micron Technology) — Memory DRAM/NAND

### Foundry/Fab Partners
- **Owns and operates its own fabs** — Micron is an IDM with memory fabs in:
  - Boise, Idaho (R&D + volume production)
  - Manassas, Virginia (automotive/industrial memory)
  - Singapore (NAND flash — joint venture with Nanya)
  - Hiroshima, Japan (via acquired Lexar/Kioxia fab operations)
  - **New:** Boise fab expansion (CHIPS Act funded) and planned **Clay, NY** mega-fab
- **PSMC partnership (2026):** Acquired PSMC's Miaoli, Taiwan fab facility; strategic tech collaboration with Powerchip Semiconductor Manufacturing Corporation for additional capacity
- Micron does **not** use external foundries for core DRAM/NAND — all manufacturing is internal

### Equipment Suppliers
- **Applied Materials (AMAT):** Long-standing partner; joint R&D program for next-gen AI memory (announced 2025); deposition & etch equipment
- **ASML:** EUV lithography systems for advanced DRAM nodes (1α, 1β)
- **Lam Research (LRCX):** Etch and deposition tools for 3D NAND and DRAM
- **Tokyo Electron (TEL):** Deposition, etch, and thermal processing tools
- **KLA Corporation:** Process control, metrology, and inspection systems
- **Advantest:** Memory test equipment (critical for DRAM/NAND testing)

### Materials Suppliers
- **Silicon wafers:** SUMCO, Shin-Etsu Chemical, Siltronic, GlobalWafers
- **Photoresist/chemicals:** JSR Corporation, Tokyo Ohka Kogyo (TOK), Fujifilm, Shin-Etsu Chemical
- **Specialty gases:** Air Liquide, Linde (formerly Praxair), Air Products
- **CMP slurries:** Cabot Microelectronics (now CMC Materials / Entegris)
- **Target materials:** Honeywell, Hitachi Metals

### IP/EDA Providers
- **Synopsys:** Design IP partner (listed on Micron partner page); DFM solutions, verification
- **Cadence:** Design IP partner (listed on Micron partner page); Spectre FX simulator for DRAM design; DLEP verification
- **Siemens EDA (Mentor):** PCB and IC verification tools
- **ARM:** Interface IP (for controller ASICs embedded in memory modules)

### OSAT/Packaging Partners
- Micron performs significant packaging in-house at its own facilities
- **ASE Technology:** Outsourced packaging for certain product lines
- **Amkor Technology:** Packaging for select memory products
- **PTI (Powertech Technology):** Taiwan-based packaging partner
- **JCET Group:** China-market packaging

### Key Dependencies & Chokepoints
- **EUV lithography (ASML):** Critical chokepoint — ASML is sole supplier of EUV tools needed for advanced DRAM nodes; limited annual output constrains capacity ramps
- **Memory test equipment (Advantest/Teradyne):** Concentrated supply for high-speed DRAM test
- **Silicon wafer supply:** Oligopolistic (SUMCO, Shin-Etsu, Siltronic); supply tightness during demand surges
- **Photoresist (JSR/TOK):** Japan-dominated supply; geopolitical risk (Japan export controls)
- **CHIPS Act execution risk:** Boise and Clay fab expansions depend on timely construction and equipment installation
- **HBM packaging capability:** Micron lags SK Hynix in HBM3E/HBM4 packaging; catching up but dependent on internal capability buildout

---

## 2. 000660.KS (SK Hynix) — Memory DRAM/NAND

### Foundry/Fab Partners
- **Owns and operates its own fabs** — SK Hynix is an IDM with fabs in:
  - Icheon, South Korea (headquarters, DRAM/NAND)
  - Cheongju, South Korea (NAND flash)
  - Wuxi, China (DRAM — older nodes, ~10-15% of total DRAM output)
  - **New:** Yongin Semiconductor Cluster (planned, massive investment)
  - **New:** U.S. packaging facility in Indiana ($3.9B investment for HBM advanced packaging)
- **TSMC partnership (critical for HBM):** SK Hynix uses TSMC's advanced foundry process for HBM base die logic; signed MOU for HBM4 co-development using TSMC's cutting-edge nodes
- **SK Hynix System IC (foundry subsidiary):** Operates a small foundry business for specialty logic

### Equipment Suppliers
- **Applied Materials (AMAT):** Expanded long-term R&D partnership (2025) for next-gen DRAM and advanced packaging at EPIC Center in Silicon Valley
- **ASML:** EUV lithography for advanced DRAM (1a node and beyond)
- **Lam Research:** Etch and deposition systems for 3D NAND and DRAM
- **Tokyo Electron (TEL):** Deposition, etch, thermal processing; **SK Hynix testing TEL's cryo etching equipment** for 400+ layer NAND
- **KLA:** Inspection and metrology
- **Hanwha Semitech:** Korean equipment supplier; supplying thermal compression bonding (TCB) equipment for HBM packaging (KRW100B+ deal)
- **Advantest & Teradyne:** Memory test equipment

### Materials Suppliers
- **Silicon wafers:** SUMCO, Shin-Etsu Chemical, Siltronic, SK Siltron (affiliated with SK Group)
- **Photoresist/chemicals:** JSR, TOK, Fujifilm, Dongjin Semichem (Korean supplier)
- **Specialty gases:** Air Liquide, Linde, SK Materials (affiliated)
- **CMP slurries:** Entegris, Fujimi
- **Bonding materials for HBM:** Critical dependency on specialized underfill and micro-bump materials

### IP/EDA Providers
- **Synopsys:** Verification (Verdi debug), design IP, DFM tools
- **Cadence:** Spectre FX FastSPICE simulator adopted for DRAM design acceleration; layout tools
- **Siemens EDA:** IC verification and PCB design
- **ARM:** Interface IP for HBM base die controllers

### OSAT/Packaging Partners
- **In-house HBM packaging:** SK Hynix has developed proprietary HBM stacking (TC NCF — thermal compression non-conductive film) and does most HBM packaging internally
- **Amkor Technology:** Strategic partnership for 2.5D packaging and interposer supply; considering joint HBM packaging business
- **TSMC:** CoWoS packaging for HBM base die integration (HBM4 and beyond)
- **ASE Technology:** Some outsourced packaging for standard DRAM/NAND products
- **New U.S. facility:** Indiana advanced packaging plant (2028+ target) for HBM

### Key Dependencies & Chokepoints
- **TSMC dependency for HBM base die:** HBM4 and beyond require TSMC's advanced logic process for the base die — creates strategic dependency on TSMC capacity allocation
- **ASML EUV:** Same as all advanced memory makers — constrained supply
- **HBM packaging yield:** SK Hynix's TC NCF process is proprietary but complex; yield improvements are critical to maintaining HBM market leadership
- **China fab risk:** Wuxi fab subject to U.S. export controls; cannot receive advanced equipment for leading-edge nodes
- **SK Group financial risk:** SK Hynix is part of the larger SK Group conglomerate; cross-shareholdings and group-level financial stress could impact investment capacity
- **HBM demand concentration:** >50% of HBM revenue tied to NVIDIA; customer concentration risk

---

## 3. INTC (Intel) — Logic Fab IDM

### Foundry/Fab Partners
- **Owns and operates its own fabs** — Intel is the largest IDM in the Western hemisphere:
  - Hillsboro, Oregon (D1X — R&D, High-NA EUV, advanced nodes)
  - Chandler, Arizona (Fab 42 and expansions)
  - Rio Rancho, New Mexico
  - Leixlip, Ireland (Fab 34 — Intel 4 process)
  - Kiryat Gat, Israel (Fab 28 — Intel 7, expanding)
  - **New:** Ohio ("Silicon Junction" — under construction, delayed)
  - **New:** Magdeburg, Germany (planned, delayed)
- **Intel Foundry (external foundry services):** Launched as contract foundry; early customers include MediaTek, Qualcomm (exploratory), AWS
- **TSMC dependency (critical):** Intel outsources significant volume to TSMC for chips it cannot manufacture competitively (e.g., Meteor Lake tile, some SoC tiles)
- **Samsung Foundry:** Secondary external foundry option for certain tiles

### Equipment Suppliers
- **ASML:** First customer for High-NA EUV (TWINSCAN EXE:5200); deep strategic partnership; Intel is ASML's lead partner for High-NA EUV deployment
- **Applied Materials:** Broad equipment supplier; U.S.-made equipment for Intel fabs
- **Lam Research:** Etch and deposition systems
- **Tokyo Electron (TEL):** Deposition, etch, thermal processing
- **KLA:** Process control and metrology
- **Carl Zeiss:** Optics for EUV lithography (ASML's key sub-supplier)
- **Advantest & Teradyne:** Test equipment

### Materials Suppliers
- **Silicon wafers:** SUMCO, Shin-Etsu, Siltronic, GlobalWafers
- **Photoresist/chemicals:** JSR, TOK, Fujifilm, Shin-Etsu
- **Specialty gases:** Air Liquide, Linde, Air Products
- **CMP slurries:** Entegris, Fujimi
- **EUV photoresist:** Emerging suppliers (Inpria, JSR/TOK EUV-specific formulations)

### IP/EDA Providers
- **Synopsys:** Major EDA partner; IC design, verification, DFM; Intel Foundry uses Synopsys tools for PDK development
- **Cadence:** Design tools, custom IC, digital implementation; Intel Foundry certified flow
- **Siemens EDA (Mentor):** Advanced collaboration for 2D/3D IC packaging solutions (announced 2025); Calibre DRC/LVS
- **ARM:** Architecture license (x86 is Intel's own, but ARM IP for foundry customers)
- **RISC-V:** Intel Foundry supports RISC-V IP for foundry customers

### OSAT/Packaging Partners
- **In-house packaging:** Intel operates significant internal packaging (EMIB, Foveros, Foveros Direct)
- **Amkor Technology:** Strategic partnership (2025) for EMIB packaging — Amkor to provide high-volume manufacturing of EMIB for AI products; Amkor's Korea facility (Incheon) handling Intel advanced packaging
- **ASE Technology:** Some outsourced packaging
- **Intel Foundry packaging services:** Offering advanced packaging (EMIB, Foveros) to external foundry customers

### Key Dependencies & Chokepoints
- **ASML High-NA EUV:** Intel is the lead adopter; massive CapEx commitment (~$300M+ per tool); if High-NA doesn't deliver yield/cost improvements, Intel's process roadmap is at risk
- **TSMC dependency for competitive products:** Intel still relies on TSMC for tiles it can't fab internally (e.g., compute tiles for Meteor Lake/Lunar Lake); this undermines the "IDM 2.0" narrative
- **Foundry business viability:** Intel Foundry has accumulated ~$30B+ in operating losses over 3 years; external foundry customers are limited; success depends on winning significant external volume
- **Process technology execution risk:** Intel 18A (1.8nm) and 14A (1.4nm) must deliver competitive yields; repeated delays have eroded trust
- **Fab construction delays:** Ohio and Germany fabs delayed; CHIPS Act funding execution risk
- **Packaging capacity:** EMIB demand from AI customers exceeds Intel's internal capacity; Amkor partnership is critical but still scaling

---

## 4. QCOM (Qualcomm) — Fabless Mobile

### Foundry/Fab Partners
- **TSMC (primary):** Qualcomm's dominant foundry partner; Snapdragon 8 Elite Gen 2 is TSMC 3nm exclusive; majority of premium Snapdragon SoCs fabricated at TSMC
- **Samsung Foundry (secondary):** Historically significant (Snapdragon 8 Gen 1 was Samsung 4nm); Qualcomm has signaled diversification away from Samsung but maintains the relationship for potential 2nm; Samsung 2nm being evaluated for future chips
- **Intel Foundry (exploratory):** Qualcomm named as potential Intel Foundry customer, but no volume production yet
- **UMC:** Used for older/low-cost modem and IoT chips

### Equipment Suppliers
- As a **fabless** company, Qualcomm does not directly purchase fab equipment. Its foundry partners (TSMC, Samsung) use:
  - ASML (EUV), Applied Materials, Lam Research, TEL, KLA
- Qualcomm does specify and co-optimize process technologies with foundry partners

### Materials Suppliers
- As a **fabless** company, Qualcomm does not directly purchase wafer materials. Dependencies flow through foundry partners:
  - TSMC's wafer suppliers: SUMCO, Shin-Etsu, Siltronic, GlobalWafers
  - TSMC's chemical suppliers: JSR, TOK, Fujifilm, Shin-Etsu
  - Samsung's supply chain: SUMCO, SK Siltron, Dongjin Semichem

### IP/EDA Providers
- **ARM:** Critical dependency — Qualcomm designs custom ARM-compatible CPU cores (Oryon); ARM architecture license is foundational
- **Synopsys:** Primary EDA partner; design, verification, IP (PCIe, USB, DDR PHY IP)
- **Cadence:** Digital implementation, custom IC, verification
- **Siemens EDA:** PCB design, verification
- **Imagination Technologies:** GPU IP (historical; now Qualcomm designs custom Adreno GPUs)
- **CEVA:** DSP IP for wireless modems
- **Qualcomm's own IP portfolio:** Massive wireless (5G/LTE/Wi-Fi) patent portfolio; significant self-developed IP

### OSAT/Packaging Partners
- **ASE Technology (including SPIL):** Major packaging partner for Snapdragon SoCs; flip-chip packaging
- **Amkor Technology:** Long-standing Qualcomm packaging partner; Qualcomm Supplier of the Year (2015); advanced packaging for mobile SoCs
- **JCET Group:** Packaging for China-market Qualcomm products
- **TSMC (InFO/CoWoS):** Some advanced packaging through TSMC's integrated offering

### Key Dependencies & Chokepoints
- **TSMC concentration risk:** >80% of Qualcomm's premium chips are fabricated at TSMC; any TSMC capacity allocation issue (e.g., priority to Apple/NVIDIA) directly impacts Qualcomm
- **ARM architecture license:** Qualcomm's ongoing legal dispute with ARM (over Oryon custom core licensing terms) creates existential risk if ARM revokes the architecture license
- **Samsung Foundry yield risk:** When Qualcomm uses Samsung, yield issues have historically caused performance/efficiency problems (Snapdragon 8 Gen 1); Qualcomm has largely moved back to TSMC
- **Mobile market cyclicality:** Qualcomm's revenue is heavily tied to smartphone demand; diversification into automotive/IoT is ongoing but still small
- **China regulatory risk:** Significant revenue exposure to China handset market; export control and geopolitical risks
- **Advanced packaging for AI:** Qualcomm needs access to advanced packaging (InFO, CoWoS) for AI inference chips; competes with Apple/NVIDIA for TSMC packaging capacity

---

## 5. TXN (Texas Instruments) — Analog

### Foundry/Fab Partners
- **Owns and operates its own fabs** — TI is pursuing **95% in-house manufacturing by 2030**:
  - Dallas, Texas (DMOS6 — 300mm analog)
  - Richardson, Texas (RFAB — 300mm, acquired from Samsung)
  - Lehi, Utah (LFAB — 300mm, acquired from Micron)
  - **New:** Sherman, Texas (SMOD — 300mm, began production 2025; CHIPS Act funded, up to $1.6B)
  - **New:** Lehi, Utah (second 300mm fab, under construction)
  - Older 200mm fabs in multiple locations
- TI does **not** use external foundries for volume production — this is a deliberate strategic choice for supply chain resilience
- TI's 300mm fabs produce analog and embedded processing chips at mature nodes (130nm–16nm)

### Equipment Suppliers
- **Applied Materials (AMAT):** Major equipment supplier; TI Supplier Excellence Award winner; providing U.S.-made equipment from Austin, TX facility to TI's U.S. factories; joint announcement (2025) with Apple for U.S. chip manufacturing
- **ASML:** Lithography tools (DUV, i-line, KrF — TI does not need EUV for analog)
- **Lam Research:** Etch and deposition
- **Tokyo Electron (TEL):** Deposition, etch, thermal processing
- **KLA:** Metrology and inspection
- **Advantest & Teradyne:** Test equipment (critical for analog — TI tests 100% of shipped products)

### Materials Suppliers
- **Silicon wafers:** SUMCO, Shin-Etsu, Siltronic, GlobalWafers (TI uses 200mm and 300mm wafers)
- **Photoresist/chemicals:** JSR, TOK, Fujifilm, Shin-Etsu (mature node photoresists)
- **Specialty gases:** Air Liquide, Linde, Air Products
- **CMP slurries:** Entegris, Fujimi
- **Leadframe and substrate materials:** Key for analog packaging (TI uses many leadframe packages)

### IP/EDA Providers
- **Synopsys:** DFM environment selected for 65nm and beyond; design verification, custom IC tools
- **Cadence:** Custom IC, analog/mixed-signal design tools (Virtuoso competitor — Cadence is dominant in analog EDA)
- **Siemens EDA:** PCB design, verification
- **ARM:** Processor IP for some embedded ARM-based MCUs
- **TI's own IP:** Massive analog/mixed-signal IP library built over decades; TI largely self-suffices on IP

### OSAT/Packaging Partners
- **In-house packaging (dominant):** TI owns and operates **7 assembly/test sites** worldwide — Philippines (3), China (2), Malaysia, Mexico — this is a key competitive advantage
- TI performs the vast majority of its packaging internally, including:
  - Leadframe packages (QFP, QFN, BGA)
  - Power packages (PowerPAD, HotRod)
  - Wafer-level packaging (WCSP)
- **Limited OSAT use:** Some overflow or specialty packaging through ASE/Amkor for specific product lines
- **Substrate suppliers:** Ibiden, AT&S, Kinsus for BGA substrates (where needed)

### Key Dependencies & Chokepoints
- **300mm fab capacity ramp:** TI's strategy depends on successfully ramping Sherman and Lehi fabs on time and on budget; construction delays or yield issues would be material
- **Test equipment (Advantest/Teradyne):** TI tests 100% of products; test equipment supply constraints can limit throughput
- **Mature node equipment:** TI uses older-generation equipment (DUV, i-line) which is still subject to supply constraints; less competition in mature node equipment market
- **Leadframe and substrate supply:** Analog packaging relies on leadframes (copper alloy) and substrates; supply is concentrated among a few Asian suppliers
- **CHIPS Act execution:** $1.6B in direct funding from U.S. CHIPS Act; must meet milestones and domestic content requirements
- **Geopolitical advantage:** TI's strategy of U.S.-centric manufacturing is a hedge against Taiwan/China geopolitical risk; but 7 A/T sites in Asia remain exposed to regional disruptions

---

## 6. MRVL (Marvell Technology) — Fabless Data Infrastructure

### Foundry/Fab Partners
- **TSMC (primary and dominant):** Marvell's longstanding foundry partner; all advanced products fabricated at TSMC
  - 5nm platform (current production)
  - 3nm platform (in production)
  - **2nm platform (announced 2024, demonstrated 2025):** Industry's first 2nm platform for accelerated infrastructure silicon; deep co-development with TSMC
  - Custom silicon (XPU) for hyperscalers (AWS, etc.) uses TSMC advanced nodes
- **Samsung Foundry (limited):** Some historical use for specific products, but TSMC is overwhelmingly dominant
- Marvell has **no internal fab capability** — 100% fabless

### Equipment Suppliers
- As a **fabless** company, Marvell does not purchase fab equipment. All equipment dependencies flow through TSMC:
  - ASML (EUV/High-NA EUV), Applied Materials, Lam Research, TEL, KLA

### Materials Suppliers
- As a **fabless** company, Marvell does not purchase wafer materials. All material dependencies flow through TSMC:
  - SUMCO, Shin-Etsu, Siltronic (wafers)
  - JSR, TOK, Fujifilm (photoresist)

### IP/EDA Providers
- **Synopsys:** Major EDA partner; design, verification, IP (PCIe, SerDes, DDR PHY); Marvell uses Synopsys IP for interface blocks
- **Cadence:** Digital implementation, custom IC, verification; Marvell uses Cadence tools for custom silicon design
- **ARM:** Architecture license for Neoverse-based custom CPUs (Marvell ThunderX series); ARM Neoverse V2/V3 used in data center products
- **RISC-V:** Marvell has explored RISC-V for some custom accelerators
- **Marvell's own IP portfolio:** Massive internal IP for SerDes, PCIe, Ethernet, custom accelerators; this is Marvell's core competitive moat — they license IP to others
- **Alphawave Semi (acquired 2024):** IP for high-speed connectivity; strengthens Marvell's IP portfolio

### OSAT/Packaging Partners
- **ASE Technology:** Primary packaging partner for Marvell's data infrastructure chips; flip-chip and advanced packaging
- **Amkor Technology:** Packaging for select products
- **TSMC (CoWoS/InFO):** Advanced packaging for Marvell's highest-end custom silicon (XPU) for hyperscalers; CoWoS access is critical
- **JCET Group:** Some packaging for China-market products

### Key Dependencies & Chokepoints
- **TSMC concentration risk (extreme):** Marvell is 100% dependent on TSMC for all advanced manufacturing; any TSMC capacity allocation issue directly impacts Marvell's ability to deliver products
- **TSMC CoWoS packaging access:** Marvell's custom XPUs for hyperscalers require CoWoS advanced packaging; competes with NVIDIA, AMD, Apple, and Broadcom for limited CoWoS capacity — this is the **#1 chokepoint**
- **ARM dependency:** Marvell's data center CPUs use ARM Neoverse IP; while Marvell customizes heavily, the ARM architecture license is foundational
- **Hyperscaler customer concentration:** Marvell's custom silicon business is increasingly tied to a small number of hyperscaler customers (AWS, potentially Google, Microsoft); customer concentration risk
- **2nm ramp timing:** Marvell's 2nm platform depends on TSMC's 2nm yield and ramp schedule; any TSMC delay cascades to Marvell
- **Custom ASIC competition:** Faces increasing competition from Broadcom and Alchip in custom hyperscaler silicon

---

## Cross-Company Dependency Summary

| Dependency | MU | SK Hynix | INTC | QCOM | TXN | MRVL |
|---|---|---|---|---|---|---|
| **TSMC dependency** | Low | Medium (HBM base die) | Medium (tiles) | High (primary fab) | None | Extreme (100%) |
| **ASML EUV** | High | High | Extreme (High-NA) | Indirect | Low (DUV only) | Indirect |
| **ARM IP** | Low | Low | Low | Critical | Low | High |
| **Synopsys/Cadence** | High | High | High | High | High | High |
| **CoWoS packaging** | Low | Medium | Low | Medium | None | Critical |
| **Silicon wafers** | High | High | High | Indirect | High | Indirect |
| **Photoresist (Japan)** | High | High | High | Indirect | Medium | Indirect |
| **China exposure** | Medium (Wuxi) | Medium (Wuxi) | Low | High (handsets) | Medium (A/T sites) | Low |

---

## Key Systemic Chokepoints

1. **ASML EUV lithography:** Single-source bottleneck for all advanced node manufacturing; ~5-6 year wait for High-NA EUV
2. **TSMC advanced packaging (CoWoS/InFO):** Capacity-constrained; allocation determines who can ship AI chips
3. **ARM architecture licensing:** Foundation of mobile (QCOM) and data center (MRVL) chip design; legal disputes create existential risk
4. **Japanese photoresist supply:** JSR/TOK/Fujifilm dominate; Japan export controls are a geopolitical lever
5. **Silicon wafer oligopoly:** SUMCO, Shin-Etsu, Siltronic control >80% of 300mm wafer supply
6. **EDA duopoly:** Synopsys + Cadence control >70% of EDA market; no viable alternatives for advanced node design
7. **Test equipment:** Advantest + Teradyne duopoly in semiconductor test; critical for memory (MU, SK Hynix) and analog (TXN)