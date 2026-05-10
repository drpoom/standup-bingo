# Phase 3A: Supplier Chain Mapping — Batch A

> Generated: 2026-05-10 | Covers: NVDA, 2330.TW (TSMC), ASML, AMD, AVGO (Broadcom), 005930.KS (Samsung)

---

## 1. NVDA (NVIDIA) — Fabless GPU/AI

### Foundry/Fab Partners
| Partner | Role | Notes |
|---------|------|-------|
| **TSMC** | Primary foundry | Manufactures virtually all NVIDIA advanced-node chips (H100, B100, B200 on 4nm/5nm/3nm). NVIDIA is TSMC's #1 or #2 customer by revenue. |
| **Samsung Foundry** | Secondary/diversification | Used for some older-node and specialty products; not a major volume partner for leading-edge GPUs. |
| **Intel Foundry** | Emerging | Announced as a potential future foundry option; no significant volume production yet. |

### Equipment Suppliers (Indirect — via TSMC)
NVIDIA is fabless and does not directly purchase fab equipment. Key equipment in its supply chain (via TSMC):
- **ASML** — EUV lithography scanners (critical for 5nm/3nm/2nm nodes)
- **Applied Materials** — Deposition, etch, CMP, inspection
- **Lam Research** — Etch and deposition
- **Tokyo Electron (TEL)** — Etch, CVD, coating/developing
- **KLA** — Process control and inspection

### Materials Suppliers (Indirect — via TSMC)
- **SUMCO** — Silicon wafers (major global supplier)
- **GlobalWafers** — Silicon wafers
- **JSR / Shin-Etsu** — Photoresist (EUV and ArFi)
- **Shin-Etsu Chemical** — Silicon wafers, photoresist, CMP slurry
- **BASF / Merck KGaA (EMD)** — Specialty chemicals, CMP slurries
- **Topco Scientific (TQP)** — Quartz components for advanced processes

### IP/EDA Providers
| Provider | Role | Notes |
|----------|------|-------|
| **Synopsys** | Primary EDA | Deep strategic partnership; NVIDIA CUDA-accelerated EDA workflows. Co-developing cuLitho computational lithography with TSMC. |
| **Cadence** | EDA tools | Design verification, physical design, PCB/signal integrity |
| **Siemens EDA (Mentor)** | EDA tools | IC verification, DFM, test |
| **ARM** | CPU IP | ARM architectures used in NVIDIA Tegra/Drive products |
| **Imagination Technologies** | GPU IP | Historical IP licensing relationships |

### OSAT/Packaging Partners
| Partner | Role | Notes |
|---------|------|-------|
| **TSMC (InFO/CoWoS)** | Advanced packaging | TSMC's CoWoS (Chip-on-Wafer-on-Substrate) is the critical packaging technology for H100/B100/B200. This is the #1 bottleneck in NVIDIA's supply chain. |
| **ASE Technology** | OSAT | Traditional packaging and test for non-AI products |
| **Amkor Technology** | OSAT | Packaging and test services |
| **SPIL (Siliconware)** | OSAT | Subsidiary of ASE; wire bond and flip-chip packaging |

### Key Dependencies & Chokepoints
1. **TSMC CoWoS capacity** — The single biggest bottleneck. NVIDIA competes with AMD, Broadcom, and others for limited CoWoS wafer capacity. TSMC is expanding but demand continues to outstrip supply.
2. **TSMC advanced-node fab capacity** — 4nm/3nm/2nm wafers are capacity-constrained; NVIDIA must compete with Apple, Qualcomm, and others.
3. **HBM supply** — NVIDIA depends on SK Hynix, Samsung, and Micron for HBM3e/HBM4 memory, which is also capacity-constrained.
4. **Geopolitical risk (Taiwan)** — ~90%+ of NVIDIA's advanced chips are manufactured in Taiwan. A Taiwan Strait crisis would be catastrophic.
5. **EUV lithography availability** — ASML EUV scanners are the gating technology for advanced nodes; any supply disruption cascades to NVIDIA.

---

## 2. 2330.TW (TSMC) — Foundry

### Foundry/Fab Partners
TSMC is the foundry — it does not outsource fabrication. However, it has strategic partnerships:
| Partner | Role | Notes |
|---------|------|-------|
| **In-house fabs** | Manufacturing | TSMC operates GIGAFABs in Taiwan (Fab 12, 14, 15, 18, 20) and expanding in Arizona (Fab 21), Japan (JASM), and Germany (ESMC). |
| **Intel Foundry** | Potential competitor/partner | TSMC and Intel compete for foundry customers; Intel also buys TSMC wafers for some chips. |

### Equipment Suppliers
| Supplier | Role | Notes |
|----------|------|-------|
| **ASML** | EUV lithography | TSMC is ASML's largest customer; operates dozens of EUV scanners. High-NA EUV ordered for 2nm and below. |
| **Applied Materials** | Deposition, etch, CMP, inspection | Major supplier across multiple process steps. New RuCo (ruthenium cobalt) solutions for 2nm. |
| **Lam Research** | Etch and deposition | Key etch equipment supplier |
| **Tokyo Electron (TEL)** | Etch, CVD, coating/developing | Dominant in coating/developing track systems |
| **KLA** | Process control/inspection | Yield management and metrology |
| **Hitachi High-Tech** | Inspection and metrology | CD-SEM and defect inspection |
| **Screen Holdings** | Coating/developing | Track systems for photoresist |
| **Nikon** | DUV lithography | I-line and KrF/ArF steppers for mature nodes |

### Materials Suppliers
| Supplier | Role | Notes |
|----------|------|-------|
| **SUMCO** | Silicon wafers | One of TSMC's primary wafer suppliers |
| **GlobalWafers** | Silicon wafers | Major Taiwanese wafer supplier |
| **Shin-Etsu Chemical** | Wafers, photoresist, CMP slurry | Japanese materials giant |
| **JSR Corporation** | Photoresist (EUV/ArFi) | Key photoresist supplier; expanding in Taiwan |
| **Merck KGaA (EMD Electronics)** | CMP slurries, specialty chemicals | Major chemical supplier |
| **BASF** | Specialty chemicals | Process chemicals |
| **Topco Scientific / TQP** | Quartz components | Dedicated new plant for TSMC 3nm |
| **Mitsui Chemicals** | CNT pellicles for EUV | Next-gen EUV pellicle supplier |
| **AEMC (Advanced Echem Materials)** | Specialty chemicals | Entering 2nm supply chain |
| **SK Hynix / Samsung / Micron** | HBM memory | TSMC packages HBM for customers |

### IP/EDA Providers
| Provider | Role | Notes |
|----------|------|-------|
| **Synopsys** | EDA tools | Deep partnership; 3Dblox open standard co-development |
| **Cadence** | EDA tools | Full-flow design tools |
| **Siemens EDA (Mentor)** | EDA tools | Verification, test, DFM |
| **Ansys** | Simulation/thermal | 3D IC thermal and electromagnetic simulation |
| **ARM** | IP licensing | Major IP provider for TSMC's ecosystem |
| **Imagination Technologies** | GPU IP | IP licensing |

### OSAT/Packaging Partners
TSMC does extensive packaging in-house (CoWoS, InFO, SoIC) but also partners:
| Partner | Role | Notes |
|---------|------|-------|
| **ASE Technology / SPIL** | OSAT | Traditional packaging and test |
| **Amkor Technology** | OSAT | Expanding partnership; building advanced packaging facility in Arizona with TSMC |
| **KYEC (King Yuan Electronics)** | Testing | Wafer and final test services |

### Key Dependencies & Chokepoints
1. **ASML EUV machines** — TSMC's entire advanced-node roadmap depends on ASML EUV scanner availability. Each machine costs $200-380M+ and has 18+ month lead times.
2. **Water and power** — TSMC's fabs consume enormous water and electricity; Taiwan's infrastructure is a constraint.
3. **Skilled labor** — Advanced process engineering talent is scarce and concentrated in Taiwan.
4. **Geopolitical risk** — TSMC's fabs are overwhelmingly in Taiwan; any conflict would halt global advanced chip production.
5. **Photoresist supply** — EUV photoresist is dominated by Japanese suppliers (JSR, Shin-Etsu, Fujifilm); limited alternative sources.
6. **CoWoS capacity** — Even TSMC struggles to expand advanced packaging fast enough to meet AI demand.

---

## 3. ASML — Lithography Equipment

### Foundry/Fab Partners
ASML manufactures its own equipment but relies on sub-system suppliers:
| Partner | Role | Notes |
|---------|------|-------|
| **In-house (Veldhoven, NL)** | Final assembly and test | All EUV and DUV systems assembled at headquarters |
| **Zeiss (Oberkochen, DE)** | Optics subsystem | Manufactures the projection optics and illumination systems for EUV |
| **VDL Groep (NL)** | Sub-assembly | Builds wafer stages and other mechanical subsystems |

### Equipment Suppliers (Sub-System & Component Vendors)
| Supplier | Role | Notes |
|----------|------|-------|
| **Carl Zeiss** | Projection optics | The sole supplier of EUV mirror optics. Each EUV system has ~10 high-precision mirrors. This is ASML's most critical dependency. |
| **Trumpf** | EUV light source | Supplies the CO₂ laser that powers the EUV source (tin droplet plasma generation). |
| **Cymer (ASML subsidiary)** | EUV source technology | Acquired in 2013; develops EUV source technology in San Diego |
| **VDL Groep** | Wafer stages, mechanical subsystems | Dutch manufacturing partner |
| **Philips** | Mechatronics, components | Historical partner; some IP licensing |
| **Festo** | Pneumatic systems | Cleanroom automation components |

### Materials Suppliers
| Supplier | Role | Notes |
|----------|------|-------|
| **Carl Zeiss** | Ultra-pure optical coatings, mirrors | Molybdenum/silicon multilayer mirrors for EUV |
| **German specialty suppliers** | Ultra-pure materials | Ruthenium, molybdenum, and other rare materials for EUV optics |
| **Japanese suppliers** | Specialty glass, ceramics | High-purity materials for optical components |
| **Mitsui Chemicals** | CNT pellicles | EUV pellicles to protect masks |
| **Various rare-earth suppliers** | Rare metals | Critical for EUV source and optics |

### IP/EDA Providers
| Provider | Role | Notes |
|----------|------|-------|
| **In-house** | Control software | ASML develops proprietary lithography control software |
| **Synopsys** | Computational lithography | Partnership on cuLitho with NVIDIA |
| **NVIDIA** | GPU compute | Powers ASML's computational lithography workloads |
| **Various EDA vendors** | Design tools | For internal chip design in control systems |

### OSAT/Packaging Partners
ASML does not use OSAT services in the traditional sense. Its machines are assembled in-house at Veldhoven, Netherlands.

### Key Dependencies & Chokepoints
1. **Carl Zeiss (optics monopoly)** — Zeiss is the sole supplier of EUV projection optics. If Zeiss cannot deliver, ASML cannot ship EUV machines. This is the single most critical dependency in the entire semiconductor supply chain.
2. **Trumpf (laser source)** — Sole supplier of the CO₂ laser for EUV light generation. Limited alternative.
3. **Export controls** — US/NL export restrictions prevent ASML from selling EUV machines to China, limiting ~25-30% of potential market.
4. **Production centralization** — All final assembly in Veldhoven, Netherlands. Single-point-of-failure risk.
5. **High-NA EUV ramp** — Next-generation High-NA EUV ($380M+ per machine) is in early production; yield and reliability risks.
6. **Rare materials** — EUV optics require ultra-pure molybdenum, ruthenium, and other materials from limited suppliers.

---

## 4. AMD — Fabless CPU/GPU

### Foundry/Fab Partners
| Partner | Role | Notes |
|---------|------|-------|
| **TSMC** | Primary foundry | Manufactures Ryzen (Zen 4/5 on 5nm/4nm), EPYC (Zen 4/5), Instinct MI300/MI325 (CoWoS on 5nm/6nm). AMD is TSMC's #2 customer by revenue. |
| **Samsung Foundry** | Secondary | Used for some older products; AMD has explored Samsung for diversification. |
| **GlobalFoundries** | Legacy/mature nodes | Former AMD subsidiary; still used for I/O chips, chipsets, and mature-node products. |

### Equipment Suppliers (Indirect — via TSMC)
Same as NVIDIA (via TSMC): ASML, Applied Materials, Lam Research, TEL, KLA, etc.

### Materials Suppliers (Indirect — via TSMC)
Same as NVIDIA (via TSMC): SUMCO, GlobalWafers, Shin-Etsu, JSR, etc.

### IP/EDA Providers
| Provider | Role | Notes |
|----------|------|-------|
| **Synopsys** | Primary EDA | Deep partnership; AMD uses Synopsys across the full design flow |
| **Cadence** | EDA tools | Verification, analog/mixed-signal design |
| **Siemens EDA (Mentor)** | EDA tools | DFT, test, PCB design |
| **ARM** | CPU IP | AMD licenses ARM for some embedded applications, though x86 is core |
| **CEVA** | DSP IP | Wireless connectivity IP |
| **RISC-V International** | ISA | Exploratory; AMD has adopted RISC-V for some embedded processors |

### OSAT/Packaging Partners
| Partner | Role | Notes |
|---------|------|-------|
| **TSMC (CoWoS/SoIC)** | Advanced packaging | MI300/MI325 use TSMC CoWoS and SoIC for chiplet integration. Major bottleneck. |
| **ASE Technology / SPIL** | OSAT | Traditional packaging and test for Ryzen, EPYC |
| **Amkor Technology** | OSAT | Packaging and test |
| **KYEC** | Testing | Wafer and final test |

### Key Dependencies & Chokepoints
1. **TSMC CoWoS capacity** — AMD's Instinct MI300/MI325/MI400 AI accelerators require TSMC CoWoS, competing directly with NVIDIA for limited capacity.
2. **TSMC advanced-node priority** — AMD competes with NVIDIA, Apple, and Qualcomm for TSMC's 4nm/3nm/2nm wafers. NVIDIA typically gets priority allocation.
3. **HBM supply** — AMD sources HBM from Samsung and SK Hynix; supply is constrained industry-wide.
4. **Samsung memory partnership** — AMD signed an MOU with Samsung for memory supply for EPYC and Instinct products, including potential foundry partnership.
5. **Geopolitical risk (Taiwan)** — Same as NVIDIA; heavy dependence on TSMC's Taiwan fabs.
6. **Chiplet integration complexity** — AMD's chiplet approach (multiple dies per package) increases packaging complexity and OSAT dependency.

---

## 5. AVGO (Broadcom) — Fabless Networking/AI

### Foundry/Fab Partners
| Partner | Role | Notes |
|---------|------|-------|
| **TSMC** | Primary foundry | Manufactures Broadcom's custom ASICs, networking chips, and AI XPUs on advanced nodes (7nm, 5nm, 3nm). Broadcom has publicly flagged TSMC capacity as a bottleneck. |
| **Samsung Foundry** | Secondary | Used for some products; less critical than TSMC. |
| **GlobalFoundries** | Mature nodes | Used for RF, connectivity, and older-process products. |

### Equipment Suppliers (Indirect — via TSMC)
Same as other fabless companies: ASML, Applied Materials, Lam Research, TEL, KLA, etc.

### Materials Suppliers (Indirect — via TSMC)
Same as other fabless companies: SUMCO, GlobalWafers, Shin-Etsu, JSR, etc.

### IP/EDA Providers
| Provider | Role | Notes |
|----------|------|-------|
| **Synopsys** | Primary EDA | Strategic partnership; 3Dblox co-development with TSMC |
| **Cadence** | EDA tools | Full-flow design, verification |
| **Siemens EDA** | EDA tools | Verification, test |
| **ARM** | IP licensing | ARM-based designs for custom ASICs |
| **Broadcom (in-house)** | Custom IP | Extensive proprietary IP portfolio (networking, SerDes, PHY) |

### OSAT/Packaging Partners
| Partner | Role | Notes |
|---------|------|-------|
| **TSMC (CoWoS/InFO)** | Advanced packaging | Broadcom's AI XPUs and custom ASICs use TSMC CoWoS. Broadcom has flagged CoWoS capacity as a constraint. |
| **ASE Technology** | OSAT | Traditional packaging and test |
| **Amkor Technology** | OSAT | Packaging and test |
| **Broadcom 3.5D F2B** | Proprietary packaging | Broadcom announced its own 3.5D Face-to-Face packaging technology for AI XPUs, reducing dependence on TSMC CoWoS long-term. |

### Key Dependencies & Chokepoints
1. **TSMC capacity** — Broadcom has explicitly stated TSMC capacity is a bottleneck for its AI chip business. Competes with NVIDIA, AMD, Apple, Qualcomm.
2. **CoWoS packaging** — Limited advanced packaging capacity constrains Broadcom's AI XPU ramp.
3. **Custom ASIC business model** — Broadcom's growing custom ASIC business (for Google TPU, Meta, etc.) depends on securing TSMC capacity for each customer.
4. **Networking/RF diversification** — Unlike NVIDIA, Broadcom has a diversified portfolio (networking, broadband, wireless) that uses multiple foundries and mature nodes, providing some resilience.
5. **3.5D F2F packaging** — Broadcom's proprietary packaging technology could reduce CoWoS dependence over time, but is still early-stage.

---

## 6. 005930.KS (Samsung) — Memory/Logic IDM

### Foundry/Fab Partners
Samsung is an IDM (Integrated Device Manufacturer) and operates its own fabs. However, it also has a foundry business:
| Partner | Role | Notes |
|---------|------|-------|
| **In-house fabs** | Memory + Logic | Operates fabs in Giheung/Hwaseong/Pyeongtaek (Korea), Xian (China), Taylor (US), and Austin (US). |
| **Samsung Foundry** | Foundry services | Serves external customers (Qualcomm, Tesla, etc.) as a foundry. |
| **GlobalFoundries** | Specialty | Some partnership on specialty processes. |

### Equipment Suppliers
| Supplier | Role | Notes |
|----------|------|-------|
| **ASML** | EUV/DUV lithography | Major EUV customer; Samsung has invested in ASML and has a strategic partnership for High-NA EUV. |
| **Applied Materials** | Deposition, etch, CMP | Key equipment supplier; Samsung joined Applied's EPIC Center for R&D (Feb 2026). |
| **Lam Research** | Etch and deposition | Major etch equipment supplier |
| **Tokyo Electron (TEL)** | Etch, CVD, track systems | Significant supplier across process steps |
| **KLA** | Process control/inspection | Yield management |
| **Nikon** | DUV lithography | ArF/i-line steppers |
| **Hitachi High-Tech** | Metrology | CD-SEM, defect inspection |
| **ZEISS** | AIMS EUV metrology | Samsung receiving AIMS EUV equipment for mask qualification |
| **Screen Holdings** | Track systems | Photoresist coating/developing |

### Materials Suppliers
| Supplier | Role | Notes |
|----------|------|-------|
| **SUMCO** | Silicon wafers | Major wafer supplier |
| **Siltronic** | Silicon wafers | German wafer supplier |
| **SK Siltron** | Silicon wafers | Korean wafer supplier (SK Group) |
| **Shin-Etsu Chemical** | Photoresist, CMP slurry, wafers | Japanese materials giant |
| **JSR Corporation** | Photoresist (EUV/ArFi) | Key photoresist supplier |
| **Merck KGaA (EMD)** | CMP slurries, specialty chemicals | Major chemical supplier |
| **BASF** | Specialty chemicals | Process chemicals |
| **Lake Materials** | Precursors | Korean precursor supplier for Taylor fab |
| **DuPont** | Photoresist, CMP | Advanced materials |
| **Samsung SDI** | Materials | Sister company; some chemical/material supply |

### IP/EDA Providers
| Provider | Role | Notes |
|----------|------|-------|
| **Synopsys** | EDA tools | Major EDA partner for Samsung Foundry |
| **Cadence** | EDA tools | Full-flow design partner |
| **Siemens EDA (Mentor)** | EDA tools | Verification, test |
| **ARM** | IP licensing | Major IP provider for Samsung Exynos and foundry customers |
| **Imagination Technologies** | GPU IP | Historical GPU IP licensing |
| **Samsung (in-house)** | Custom IP | Extensive proprietary IP (memory, logic, RF) |

### OSAT/Packaging Partners
Samsung does significant packaging in-house but also uses OSATs:
| Partner | Role | Notes |
|---------|------|-------|
| **In-house** | Advanced packaging | Samsung operates its own packaging for memory (3D V-NAND stacking, HBM) and logic (I-Cube4, X-Cube). |
| **ASE Technology** | OSAT | External packaging for some products |
| **Amkor Technology** | OSAT | Packaging partner; Samsung is an investor in Amkor |
| **JCET (Jiangsu Changdian)** | OSAT | Chinese OSAT for some products |

### Key Dependencies & Chokepoints
1. **ASML EUV equipment** — Samsung's advanced logic foundry (3nm GAA, 2nm) depends entirely on ASML EUV scanners. Equipment delivery delays directly impact Samsung's competitiveness vs. TSMC.
2. **Memory cyclicality** — Samsung's DRAM/NAND business is highly cyclical; downturns can subsidize foundry investments but create earnings volatility.
3. **Foundry competitiveness** — Samsung Foundry lags TSMC in yield and customer trust; losing key customers (e.g., Qualcomm shifting to TSMC) threatens the foundry business model.
4. **Taylor fab uncertainty** — Samsung's $17B Taylor, Texas fab was delayed for years; now anchored by a Tesla foundry deal. Execution risk remains high.
5. **HBM competition** — Samsung competes with SK Hynix in HBM; SK Hynix has led in HBM3e, putting pressure on Samsung's AI memory position.
6. **Korean ecosystem dependence** — Heavy reliance on Korean suppliers and labor; geopolitical risk on Korean peninsula.
7. **Chinese market exposure** — Significant memory revenue from China; export controls and geopolitical tensions create risk.

---

## Cross-Company Dependency Matrix

| Dependency | NVDA | TSMC | ASML | AMD | AVGO | Samsung |
|-----------|------|------|------|-----|------|---------|
| **TSMC (fab)** | ⬛ Critical | — | N/A | ⬛ Critical | ⬛ Critical | N/A (competitor) |
| **ASML EUV** | ⬛ (via TSMC) | ⬛ Critical | — | ⬛ (via TSMC) | ⬛ (via TSMC) | ⬛ Critical |
| **Zeiss optics** | ⬛ (via ASML) | ⬛ (via ASML) | ⬛ Critical | ⬛ (via ASML) | ⬛ (via ASML) | ⬛ (via ASML) |
| **CoWoS packaging** | ⬛ Critical | ⬛ (owns) | N/A | ⬛ Critical | ⬛ Critical | N/A (in-house) |
| **HBM memory** | ⬛ (SK Hynix/Samsung) | ⬛ (packages for customers) | N/A | ⬛ (Samsung/SK Hynix) | ⬛ (SK Hynix) | ⬛ (produces) |
| **Synopsys EDA** | ⬛ Critical | ⬛ Critical | ⬛ | ⬛ Critical | ⬛ Critical | ⬛ Critical |
| **Taiwan geo risk** | ⬛ Critical | ⬛ Critical | ⬛ | ⬛ Critical | ⬛ Critical | ⬛ (less) |
| **Japan materials** | ⬛ (via TSMC) | ⬛ Critical | ⬛ Critical | ⬛ (via TSMC) | ⬛ (via TSMC) | ⬛ Critical |

Legend: ⬛ = High dependency | ⬛ = Moderate | ⬛ = Low | N/A = Not applicable

---

## Key Supply Chain Insights

### Single Points of Failure
1. **ASML → Zeiss (EUV optics)** — The most concentrated dependency in the semiconductor industry. Zeiss is the sole source for EUV projection optics.
2. **TSMC (advanced nodes)** — All 5 fabless leaders depend on TSMC for leading-edge manufacturing. No viable alternative at equivalent yields.
3. **TSMC CoWoS** — The packaging bottleneck constraining all AI chip production.
4. **SK Hynix (HBM)** — Dominant HBM3e supplier; all AI chip companies depend on limited HBM supply.

### Geopolitical Concentration Risk
- **Taiwan**: TSMC, ASE, and the entire advanced packaging ecosystem are concentrated on a small island with geopolitical risk.
- **Netherlands**: ASML and Zeiss are the sole sources for EUV lithography.
- **Japan**: Photoresist (JSR, Shin-Etsu, Fujifilm) and wafer (SUMCO) supply is heavily Japanese.
- **Korea**: Samsung and SK Hynix dominate memory; Korean peninsula risk.

### Emerging Diversification Trends
- **TSMC Arizona** — Fab 21 producing for Apple, AMD; slow ramp but progressing.
- **Samsung Taylor** — Anchored by Tesla foundry deal; execution risk.
- **Intel Foundry** — Potential third foundry option but struggling with yields and customer acquisition.
- **Broadcom 3.5D F2F** — Proprietary packaging to reduce CoWoS dependence.
- **Japan Rapidus** — Emerging 2nm foundry; too early to be meaningful.