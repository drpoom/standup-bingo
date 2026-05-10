# Phase 3C: Supplier Chain Mapping — Batch C

> Equipment & EDA companies have fundamentally different supplier dynamics than fabless chip companies. They are **upstream suppliers themselves** — so the focus here is on their own upstream inputs (optics, lasers, electronics, precision components, software tools) and their downstream customer concentration risks.

---

## 1. LRCX — Lam Research (Equipment: Etch & Deposition)

### Foundry/Fab Partners
- **Not applicable** — Lam does not manufacture chips; it builds equipment that chipmakers use.
- Lam operates R&D/demo fabs (e.g., collaboration with IMEC, CEA-Leti) for process development but does not produce commercial wafers.

### Equipment Suppliers (Lam's Own Upstream)
- **RF Power Generators**: Advanced Energy Industries (AEIS), MKS Instruments (MKSI) — critical for plasma generation in etch chambers
- **Vacuum Pumps**: Edwards (Atlas Copco), Pfeiffer Vacuum, Kashiyama — essential for chamber vacuum
- **Mass Flow Controllers (MFCs)**: MKS Instruments, Horiba STEC — control gas flows into etch/deposition chambers
- **Robotics & Wafer Handling**: Brooks Automation (now Azenta), Hirata — wafer transport within tools
- **Power Supplies**: Advanced Energy, Comet Holdings — RF/match networks
- **Sensors & Instrumentation**: MKS Instruments, Horiba — pressure, gas composition sensors

### Materials Suppliers
- **Silicon Components**: Silfex (Lam-owned subsidiary since 2019) — manufactures critical silicon consumable parts (showerheads, focus rings) for etch chambers
- **Specialty Gases**: Linde, Air Liquide, Air Products — process gases (CF₄, SF₆, Cl₂, etc.)
- **Ceramics & Quartz**: CoorsTek, various Japanese ceramic suppliers — chamber liners, windows

### IP/EDA Providers
- **Internal**: Lam develops proprietary process control software and algorithms in-house
- **Simulation/Modeling**: ANSYS, COMSOL — for chamber fluid dynamics and plasma simulation
- **Design Tools**: Cadence, Synopsys — for internal chip design (sensor controllers, embedded systems)

### OSAT/Packaging Partners
- **Not applicable** — Lam ships capital equipment, not packaged chips

### Key Dependencies & Chokepoints
| Dependency | Risk Level | Notes |
|---|---|---|
| **Customer concentration** | 🔴 HIGH | Top 2 customers (Samsung + TSMC) typically represent ~40-50% of revenue |
| **RF power generators** | 🟡 MEDIUM | AEIS and MKSI dominate; dual-source but limited |
| **Silicon consumables** | 🟢 LOW | Vertically integrated via Silfex acquisition |
| **Specialty gases** | 🟡 MEDIUM | Oligopolistic supply (Linde, Air Liquide, Air Products) |
| **China exposure** | 🔴 HIGH | ~25-30% of revenue from China (export control risk) |
| **Cyclicality** | 🔴 HIGH | Revenue highly cyclical with fab capex cycles |

---

## 2. AMAT — Applied Materials (Equipment: Deposition/Process/Inspection)

### Foundry/Fab Partners
- **Not applicable** — AMAT is a pure-play equipment supplier
- Operates Maydan Technology Center and collaborates with IMEC for process development

### Equipment Suppliers (AMAT's Own Upstream)
- **RF Power & Plasma**: Advanced Energy Industries (AEIS), MKS Instruments — RF generators, matching networks
- **Vacuum Pumps**: Edwards (Atlas Copco), Pfeiffer Vacuum — turbomolecular and dry pumps
- **Mass Flow Controllers**: MKS Instruments, Horiba STEC — gas delivery
- **Robotics**: Hirata, Brooks/Azenta — wafer handling automation
- **Optics & Light Sources**: Coherent, MKS/Newport — for metrology/inspection modules
- **Power Electronics**: Advanced Energy, Comet — high-power RF systems
- **Precision Motion**: Aerotech, Physik Instrumente — stage positioning

### Materials Suppliers
- **Sputtering Targets**: Honeywell Electronic Materials, JX Nippon Mining & Metals, Tosoh — PVD target materials
- **Process Chemicals**: Air Liquide, Linde, Entegris — CVD/ALD precursors
- **Ceramics & Insulators**: CoorsTek, various Japanese suppliers — chamber components
- **CMP Consumables**: Dow Electronic Materials, Cabot Microelectronics (now CMC Materials) — slurries and pads (AMAT is also a major CMP equipment maker)

### IP/EDA Providers
- **Internal**: Extensive proprietary software for process control, AI-driven analytics (SmartFactory RX)
- **Design Tools**: Cadence, Synopsys — for internal IC design
- **AI/ML Platforms**: Partnerships with NVIDIA for AI-accelerated process optimization

### OSAT/Packaging Partners
- **Not applicable** — capital equipment supplier

### Key Dependencies & Chokepoints
| Dependency | Risk Level | Notes |
|---|---|---|
| **Customer concentration** | 🔴 HIGH | Samsung, TSMC, Intel collectively ~50%+ of revenue |
| **Broadest equipment portfolio** | 🟢 STRENGTH | Most diversified equipment maker (deposition, etch, CMP, inspection, ion implant) |
| **Sputtering targets** | 🟡 MEDIUM | Concentrated supply (Honeywell, JX Nippon) |
| **China exposure** | 🔴 HIGH | ~30% of revenue from China; significant export control risk |
| **Process chemicals/precursors** | 🟡 MEDIUM | Oligopolistic supply structure |
| **Cyclicality** | 🔴 HIGH | Revenue tied to fab capex cycles |

---

## 3. 8035.T — Tokyo Electron (Equipment: Coater/Developer, Etch, Deposition, Cleaning)

### Foundry/Fab Partners
- **Not applicable** — TEL is a pure-play semiconductor equipment manufacturer
- Operates TEL Technology Center and collaborates with imec

### Equipment Suppliers (TEL's Own Upstream)
- **RF Power Systems**: Advanced Energy Industries, Daihen — RF generators for etch/deposition
- **Vacuum Pumps**: Edwards (Atlas Copco), Pfeiffer Vacuum, Ulvac — vacuum systems
- **Mass Flow Controllers**: Horiba STEC (major Japanese supplier), MKS Instruments — gas control
- **Robotics & Wafer Handling**: Hirata Corporation (Japanese, key partner), RORZE — automation
- **Optics & Light Sources**: Nikon, Canon — for alignment/inspection subsystems
- **Motion Control**: THK, NSK — precision linear guides and bearings
- **Cleanroom Equipment**: Various Japanese specialists

### Materials Suppliers
- **Photoresist & Chemicals**: JSR, Tokyo Ohka Kogyo (TOK), Shin-Etsu Chemical — critical for coater/developer systems
- **Process Gases**: Air Liquide, Taiyo Nippon Sanso, Showa Denko — specialty gases
- **Ceramics & Quartz**: Japan Fine Ceramics, various Japanese suppliers — chamber components
- **CMP Consumables**: Fujimi Incorporated — polishing compounds

### IP/EDA Providers
- **Internal**: Proprietary process control and automation software
- **Design Tools**: Cadence, Synopsys — for internal chip design needs
- **Collaboration**: Strong ties with Japanese research institutes (AIST, University of Tokyo)

### OSAT/Packaging Partners
- **Not applicable** — capital equipment supplier

### Key Dependencies & Chokepoints
| Dependency | Risk Level | Notes |
|---|---|---|
| **Coater/developer dominance** | 🟢 STRENGTH | ~90% market share in coater/developer — extremely defensible |
| **Customer concentration** | 🔴 HIGH | Samsung, TSMC, SK Hynix are top customers; ~60%+ revenue from top 5 |
| **Japanese supply chain** | 🟡 MEDIUM | Deeply embedded in Japanese supplier ecosystem (Horiba, Hirata, etc.) — resilient but concentrated |
| **China exposure** | 🔴 HIGH | ~30%+ revenue from China; significant export control risk |
| **Photoresist dependency** | 🟡 MEDIUM | Coater/developer tools tightly coupled to photoresist chemistry (JSR, TOK, Shin-Etsu) |
| **Yen fluctuation** | 🟡 MEDIUM | Significant FX risk as costs are JPY-denominated but revenue is USD-denominated |

---

## 4. SNPS — Synopsys (IP/EDA)

### Foundry/Fab Partners
- **Not applicable** — Synopsys is a software/IP company, not a chip manufacturer
- **Deep foundry partnerships**: TSMC (long-standing joint development), Samsung, Intel Foundry, GlobalFoundries — for PDK development and design rule collaboration

### Equipment Suppliers
- **Not applicable** — Synopsys does not manufacture physical equipment
- **Internal IT/Compute**: Relies on cloud providers (AWS, Azure, GCP) and NVIDIA GPUs for EDA tool development and AI training

### Materials Suppliers
- **Not applicable** — Software and IP company with minimal physical materials needs

### IP/EDA Providers (Synopsys's Own Upstream)
- **Cloud Infrastructure**: AWS, Microsoft Azure, Google Cloud — for cloud EDA delivery
- **AI/ML Infrastructure**: NVIDIA (GPU compute for DSO.ai and other AI-driven EDA tools)
- **Open-Source Foundations**: RISC-V International, CHIPS Alliance — for IP ecosystem
- **Third-Party IP**: ARM (Synopsys is both a partner and competitor in IP), various specialty IP vendors
- **Internal**: Synopsys is itself one of the two dominant EDA providers — minimal upstream EDA dependency

### OSAT/Packaging Partners
- **Not applicable** — software/IP company

### Key Dependencies & Chokepoints
| Dependency | Risk Level | Notes |
|---|---|---|
| **TSMC partnership** | 🔴 HIGH | Deep co-development relationship; TSMC is both key partner and customer |
| **Cloud infrastructure** | 🟡 MEDIUM | Increasingly dependent on AWS/Azure/GCP for cloud EDA delivery |
| **NVIDIA GPU supply** | 🟡 MEDIUM | AI-driven EDA (DSO.ai) requires significant GPU compute |
| **ARM relationship** | 🟡 MEDIUM | Complex dynamic — ARM is both partner (IP ecosystem) and competitor |
| **Customer concentration** | 🟡 MEDIUM | Top 10 customers represent significant revenue; TSMC, Samsung, Intel, NVIDIA among them |
| **Ansys acquisition** | 🔴 HIGH | Regulatory scrutiny; integration risk if completed (~$35B deal) |
| **Software talent** | 🟡 MEDIUM | Highly dependent on specialized EDA engineering talent |

---

## 5. CDNS — Cadence Design Systems (IP/EDA)

### Foundry/Fab Partners
- **Not applicable** — Cadence is a software/IP company
- **Deep foundry partnerships**: TSMC (long-standing collaboration on advanced nodes), Samsung, Intel Foundry, GlobalFoundries — for design flow certification and 3D-IC co-development

### Equipment Suppliers
- **Not applicable** — Cadence does not manufacture physical equipment
- **Internal IT/Compute**: Cloud providers and NVIDIA GPUs for AI/ML-driven EDA

### Materials Suppliers
- **Not applicable** — Software and IP company

### IP/EDA Providers (Cadence's Own Upstream)
- **Cloud Infrastructure**: AWS, Microsoft Azure, Google Cloud — for cloud EDA (Cadence Cloud)
- **AI/ML Infrastructure**: NVIDIA (GPU compute for Cerebrus AI-driven design optimization)
- **Open-Source**: RISC-V ecosystem, various open-source EDA initiatives
- **Third-Party IP**: ARM (partner/competitor dynamic), various specialty IP vendors
- **Internal**: Cadence is one of the two dominant EDA providers — minimal upstream EDA dependency

### OSAT/Packaging Partners
- **Not applicable** — software/IP company

### Key Dependencies & Chokepoints
| Dependency | Risk Level | Notes |
|---|---|---|
| **TSMC partnership** | 🔴 HIGH | Critical co-development relationship; TSMC is both partner and customer |
| **Cloud infrastructure** | 🟡 MEDIUM | Growing dependence on cloud delivery model |
| **NVIDIA GPU supply** | 🟡 MEDIUM | AI-driven EDA (Cerebrus) requires significant GPU compute |
| **ARM relationship** | 🟡 MEDIUM | Complex partner-competitor dynamic in IP |
| **Customer concentration** | 🟡 MEDIUM | Top customers include TSMC, Samsung, Intel, Qualcomm, NVIDIA |
| **Record backlog** | 🟢 STRENGTH | ~$8B backlog provides significant revenue visibility |
| **Software talent** | 🟡 MEDIUM | Highly dependent on specialized EDA engineering talent |
| **Duopoly dynamics** | 🟡 MEDIUM | EDA market is effectively a duopoly (Cadence + Synopsys); regulatory scrutiny on further consolidation |

---

## 6. KLAC — KLA Corporation (Equipment: Inspection & Metrology)

### Foundry/Fab Partners
- **Not applicable** — KLA is a pure-play process control equipment supplier
- Collaborates with foundries for process development (TSMC, Samsung, Intel)

### Equipment Suppliers (KLA's Own Upstream)
- **Optics & Lenses**: ZEISS SMT (critical — primary optics supplier), Jenoptik, Nikon — lenses, objectives, illumination systems
- **Lasers & Light Sources**: Coherent, MKS/Spectra-Physics, TRUMPF — DUV/EUV light sources, laser subsystems
- **Detectors & Sensors**: Hamamatsu Photonics, Sony (image sensors), Teledyne e2v — CCD/CMOS sensors for inspection
- **Motion Control**: Aerotech, Physik Instrumente, THK — precision stages and positioning
- **Vacuum Systems**: Edwards, Pfeiffer — for e-beam and EUV inspection tools
- **Electronics & FPGA**: Xilinx (AMD), Intel/Altera — FPGAs for real-time image processing
- **Computing Hardware**: NVIDIA, Intel — GPUs and CPUs for AI-based defect classification

### Materials Suppliers
- **Optical Coatings**: Various specialty optical coating suppliers
- **Cleanroom Consumables**: Entegris, various specialty suppliers
- **Reference Wafers/Standards**: Various — for calibration of inspection tools

### IP/EDA Providers
- **Internal**: KLA develops extensive proprietary image processing, AI/ML, and pattern recognition algorithms in-house
- **Design Tools**: Cadence, Synopsys — for internal chip design (sensor controllers, processing electronics)
- **AI/ML Frameworks**: TensorFlow, PyTorch — for defect classification model development

### OSAT/Packaging Partners
- **Not applicable** — capital equipment supplier
- KLA tools are used BY OSATs (ASE, Amkor) for inspection, but KLA does not provide packaging services

### Key Dependencies & Chokepoints
| Dependency | Risk Level | Notes |
|---|---|---|
| **ZEISS optics dependency** | 🔴 HIGH | ZEISS SMT is the dominant supplier of high-end optics; extremely difficult to replace |
| **Customer concentration** | 🔴 HIGH | Top 5 customers (TSMC, Samsung, SK Hynix, Intel, Micron) represent ~50%+ revenue |
| **Hamamatsu detectors** | 🟡 MEDIUM | Key sensor supplier; limited alternatives for high-sensitivity applications |
| **China exposure** | 🔴 HIGH | Significant revenue from China; export control risk on advanced inspection tools |
| **EUV inspection** | 🟢 STRENGTH | Dominant position in EUV mask/wafer inspection — growing with EUV adoption |
| **AI/ML capability** | 🟢 STRENGTH | Increasingly using AI for defect classification — competitive moat |
| **Duopoly with Applied Materials** | 🟡 MEDIUM | AMAT competes in some inspection segments but KLA dominates yield management |

---

## Cross-Cutting Themes: Batch C

### 1. Equipment Companies Share Common Upstream Suppliers
The three equipment makers (LRCX, AMAT, TEL) all depend on a common set of upstream component suppliers:
- **RF Power**: Advanced Energy (AEIS), MKS Instruments
- **Vacuum**: Edwards/Atlas Copco, Pfeiffer
- **Gas Control**: MKS Instruments, Horiba
- **Robotics**: Hirata, Brooks/Azenta

This creates **correlated supply risk** — a disruption at AEIS or MKS affects all three simultaneously.

### 2. KLA Has the Most Concentrated Upstream Dependency
KLA's dependence on **ZEISS SMT** for optics is the single most concentrated supplier relationship in this batch. ZEISS is also ASML's sole optics supplier for EUV lithography, making it a systemic chokepoint.

### 3. EDA Companies Have Minimal Physical Supply Chains
Synopsys and Cadence have fundamentally different risk profiles — their key dependencies are:
- **Cloud infrastructure** (AWS, Azure, GCP)
- **GPU compute** (NVIDIA)
- **Talent** (specialized EDA engineers)
- **Foundry partnerships** (TSMC, Samsung)

They face almost zero physical supply chain risk but have **talent concentration** and **platform dependency** risks.

### 4. China Exposure Is a Universal Risk
All six companies face significant China revenue exposure (20-30%+), creating correlated regulatory/export control risk across the entire batch.

### 5. Customer Concentration Mirrors Foundry Oligopoly
All equipment companies face extreme customer concentration because the semiconductor foundry market is itself concentrated (TSMC ~60%, Samsung ~15%, Intel emerging). This is structural and cannot be diversified away.

### 6. Japan's Materials Grip
TEL and KLA both depend heavily on Japanese specialty suppliers (Horiba, Hamamatsu, JSR, TOK, Shin-Etsu). Japan's dominance in photoresist, optical components, and precision instruments creates a geographic concentration risk.

---

*Last updated: 2026-05-10*