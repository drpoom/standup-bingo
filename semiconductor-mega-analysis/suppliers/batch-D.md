# Supplier Chain Mapping — Batch D

> Companies: IFX (Infineon), STM (STMicroelectronics), 6702.T (Advantest), ADI (Analog Devices), 3711.TW (ASE Technology), NXPI (NXP)

---

## 1. Infineon (IFX) — Analog Power/Auto

### Foundry/Fab Partners
- **Own fabs**: Infineon operates its own 200mm and 300mm fabs — Dresden (300mm power), Villach (300mm power), Kulim (200mm power), Regensburg (200mm)
- **GlobalFoundries**: Long-term strategic agreement (extended 2024) for automotive MCU production on 40nm eFlash and 22FDX processes
- **TSMC**: Joint venture partner in ESMC (European Semiconductor Manufacturing Company) alongside Bosch, NXP — building a fab in Dresden for 28/22nm automotive chips
- **TSMC (JASM)**: Capacity for advanced nodes via JASM Kumamoto fab

### Equipment Suppliers
- **Applied Materials**: Deposition and etch tools for Infineon's fabs
- **ASML**: EUV and DUV lithography for advanced nodes
- **Lam Research**: Etch and deposition equipment
- **Tokyo Electron (TEL)**: CVD, etch, and coating/developing tools
- **KLA**: Process control and inspection

### Materials Suppliers
- **Siltronic (Wacker)**: Primary silicon wafer supplier (300mm)
- **SUMCO**: Silicon wafer supply
- **Shin-Etsu Chemical**: Silicon wafers and photoresist
- **JSR/Tokyo Ohka Kogyo (TOK)**: Photoresist materials
- **BASF, Merck (EMD)**: Specialty chemicals and CMP slurries
- **Linde/Air Liquide**: Specialty gases

### IP/EDA Providers
- **Synopsys**: Primary EDA partner — design tools, verification, IP (strategic partnership)
- **Cadence**: Design tools for analog/mixed-signal
- **ARM**: Processor IP for automotive MCUs (Cortex-M, Cortex-R series)
- **CEVA**: DSP IP for connectivity

### OSAT/Packaging Partners
- **ASE**: Major OSAT partner — Infineon sold its Cavite (Philippines) and Cheonan (South Korea) assembly/test sites to ASE in 2024, deepening the strategic partnership
- **Amkor**: Deepened partnership in 2024 — Amkor provides packaging services from Porto, Portugal facility for European supply chain resilience
- **In-house**: Infineon retains some backend operations in Europe and Malaysia

### Key Dependencies & Chokepoints
- **300mm wafer supply**: Heavy reliance on Siltronic/SUMCO for 300mm wafers — capacity constrained during upcycles
- **GlobalFoundries capacity**: Long-term agreement locks in supply but creates mutual dependency for automotive MCUs
- **ESMC fab timeline**: Joint venture fab in Dresden not expected to produce until ~2027; near-term capacity still dependent on existing foundry partners
- **Rare earths & specialty materials**: Power semiconductors (IGBTs, SiC) require specific substrate materials; SiC wafer supply (from Wolfspeed, Coherent) is a bottleneck
- **Geopolitical risk**: Significant China exposure (~30% of revenue); export control and China-for-China dynamics

---

## 2. STMicroelectronics (STM) — Analog/Sensors

### Foundry/Fab Partners
- **Own fabs**: Extensive in-house manufacturing — 14 main sites including Crolles (300mm digital), Catania (power/BiC), Tours (200mm), Rousset (200mm), Agrate (300mm), Kirkop (Malta), Ang Mo Kio (Singapore)
- **TSMC**: Outsourced foundry for advanced digital nodes
- **Hua Hong**: Partnership for "China-for-China" STM32 production (volume production started 2026)
- **GlobalFoundries**: Outsourced capacity for specialty processes

### Equipment Suppliers
- **Applied Materials**: Broad range of fab equipment
- **ASML**: Lithography (DUV/EUV)
- **Lam Research**: Etch and deposition
- **Tokyo Electron (TEL)**: CVD, etch, track systems
- **KLA**: Inspection and metrology
- **ASM International**: ALD and epitaxy tools

### Materials Suppliers
- **SUMCO**: Silicon wafer supply (major supplier)
- **Siltronic**: Silicon wafers
- **Shin-Etsu Chemical**: Wafers and photoresist
- **JSR/TOK**: Photoresist
- **BASF/Merck**: Chemicals and CMP slurries
- **Soitec**: SOI wafers for RF and FD-SOI processes
- **Air Liquide/Linde**: Specialty gases

### IP/EDA Providers
- **ARM**: Major IP partner — STM32 microcontrollers use ARM Cortex-M cores extensively
- **Synopsys**: EDA tools, verification, and IP (long-standing partnership for 32nm and beyond)
- **Cadence**: Analog/mixed-signal design tools
- **CEVA**: DSP and connectivity IP
- **Imagination Technologies**: GPU IP for STM32

### OSAT/Packaging Partners
- **ASE**: Assembly and test partner (PCN records show ASE Kaohsiung as qualified packaging source)
- **Amkor**: Packaging services
- **In-house**: ST maintains significant back-end operations at its own facilities (Catania, Malta, Morocco, Philippines)

### Key Dependencies & Chokepoints
- **Own fab utilization**: ST's strategy relies heavily on in-house manufacturing (~70% of output); underutilization during downturns is a margin risk
- **Hua Hong dependency**: China-for-China strategy creates technology transfer concerns and regulatory risk
- **SiC substrate supply**: ST is vertically integrating SiC (acquired Norstel AB for substrate production), but still depends on external SiC wafer supply
- **Soitec SOI wafers**: FD-SOI process depends on Soitec as sole-source for SOI substrates
- **European energy costs**: High fab operating costs in Europe vs. Asia competitors
- **Automotive cyclicality**: Heavy automotive exposure (~40% of revenue) creates demand volatility

---

## 3. Advantest (6702.T) — Equipment (Test)

### Foundry/Fab Partners
- **N/A** — Advantest is an equipment maker, not a chip manufacturer. It does not use foundry services for its own products in the traditional sense.
- **Internal manufacturing**: Advantest uses a hybrid model — in-house production for critical components, EMS (Electronics Manufacturing Services) partners for assembly of standard subsystems

### Equipment Suppliers (Component Suppliers for Advantest's Testers)
- **FPGA suppliers**: Xilinx (AMD) and Intel/Altera — high-end FPGAs are critical components in Advantest's test systems (V93000, T2000)
- **Custom ASIC foundries**: TSMC for custom test ASICs designed by Advantest
- **NVIDIA**: GPU compute modules for AI-focused test solutions
- **PCB/substrate suppliers**: Unimicron, AT&S, Ibiden — high-density PCBs for test heads
- **Precision mechanical components**: Japanese suppliers (THK, NSK for linear motion; Keyence for sensors)
- **Power supply vendors**: TDK-Lambda, Cosel for high-precision power modules
- **Connector/cable suppliers**: Japanese specialty connector makers

### Materials Suppliers
- **Semiconductor-grade components**: Sourced from broad distributor base (Digi-Key, Mouser, Arrow for standard parts)
- **Specialty materials**: Limited direct materials exposure — Advantest assembles test systems rather than processing wafers

### IP/EDA Providers
- **Synopsys**: Design tools for Advantest's custom ASIC development
- **Cadence**: IC design and verification
- **Mentor (Siemens EDA)**: PCB design tools
- **In-house IP**: Advantest develops proprietary test algorithms, pin electronics IP, and tester architecture IP — this is their core competitive moat

### OSAT/Packaging Partners
- **N/A** — Advantest does not produce semiconductor devices for sale; it produces test equipment
- **EMS partners**: Advantest outsources some system assembly to EMS providers (details not fully disclosed; likely includes Japanese and Southeast Asian contract manufacturers)

### Key Dependencies & Chokepoints
- **FPGA supply**: Critical dependency on AMD (Xilinx) and Intel (Altera) for high-end FPGAs — these are sole-source components with long lead times (>6 months for high-end SoC testers)
- **Custom ASIC capacity**: Relies on TSMC for manufacturing its proprietary test ASICs — capacity allocation risk during foundry tightness
- **Rare earths & specialty components**: Precision motion components and high-speed connectors from concentrated Japanese supply base
- **Applied Materials partnership**: 2026 strategic partnership with Applied Materials and joining EPIC platform — signals move toward closer integration with process equipment ecosystem
- **Customer concentration**: Top customers (TSMC, Samsung, Intel) represent significant revenue concentration
- **Duopoly dynamics**: Competes primarily with Teradyne in SoC test; market share battles are intense and cyclical
- **Lead times**: High-end SoC tester lead times can extend to 6+ months during demand surges

---

## 4. Analog Devices (ADI) — Analog

### Foundry/Fab Partners
- **Own fabs**: ADI operates a "Resilient Hybrid Manufacturing Network" — owns fabs in Wilmington MA (compound semiconductors), Beaverton OR, Camas WA, Limerick Ireland
- **TSMC**: Expanded strategic partnership (2024) — long-term wafer capacity agreement through JASM (Japan Advanced Semiconductor Manufacturing) for 40nm and other nodes
- **GlobalFoundries**: Outsourced foundry for specialty analog processes
- **Tower Semiconductor**: Specialty foundry for analog/RF processes
- **TSMC (Taiwan)**: Primary advanced node foundry partner

### Equipment Suppliers
- **Applied Materials**: Deposition, etch, and CMP tools
- **ASML**: Lithography equipment
- **Lam Research**: Etch and deposition
- **KLA**: Process control and inspection
- **Tokyo Electron**: CVD and track systems

### Materials Suppliers
- **SUMCO/Siltronic**: Silicon wafers
- **Soitec**: SOI wafers for RF and high-performance analog
- **Shin-Etsu**: Silicon wafers and photoresist
- **BASF/Merck**: Specialty chemicals
- **III-V materials suppliers**: GaAs, GaN substrate suppliers for compound semiconductor products
- **Air Liquide/Linde**: Specialty gases

### IP/EDA Providers
- **ARM**: Cortex-M IP for ADI's microcontroller products
- **Synopsys**: EDA tools, verification, and IP — primary design platform
- **Cadence**: Analog/mixed-signal design tools
- **CEVA**: DSP IP for connectivity products

### OSAT/Packaging Partners
- **ASE**: Major packaging and test partner
- **Amkor**: Packaging services
- **In-house**: ADI operates its own assembly & test in Chelmsford MA and Cavite Philippines (though some operations have been restructured)
- **SPIL (Siliconware)**: Test and packaging services

### Key Dependencies & Chokepoints
- **TSMC capacity**: Expanded partnership creates deep dependency on TSMC for advanced nodes; JASM fab capacity is allocated but still ramping
- **Compound semiconductor supply**: ADI's RF/power products use GaAs, GaN, SiC — these substrates have limited supplier base (Wolfspeed, Qorvo, MACOM for GaN; Skyworks for GaAs)
- **Analog fab economics**: ADI's own fabs run older process nodes (0.18μm to 65nm) — capital intensity with limited ability to scale quickly
- **Soitec SOI dependency**: For RF switches and high-performance analog, SOI wafers from Soitec are critical and limited-source
- **Automotive/industrial cyclicality**: ~50% of revenue from industrial, ~25% automotive — cyclical demand risk
- **Resilient manufacturing model**: While diversified, managing 4+ own fabs plus multiple foundry partners creates operational complexity

---

## 5. ASE Technology (3711.TW) — OSAT

### Foundry/Fab Partners
- **N/A** — ASE is an OSAT (Outsourced Semiconductor Assembly and Test) provider, not a chip designer. It packages and tests chips manufactured by foundries.
- **Key foundry relationships**: ASE works closely with TSMC (3DFabric Alliance partner), Samsung, GlobalFoundries, and Intel Foundry as their packaging partner

### Equipment Suppliers
- **KLA**: Inspection and metrology for packaging — critical for yield management
- **Applied Materials**: Deposition, etch, and packaging equipment
- **ASM Pacific Technology (ASMPT)**: Wire bonding, die attach, and molding equipment — major supplier
- **K&S (Kulicke & Soffa)**: Wire bonding and advanced packaging equipment
- **Besi**: Die attach and flip-chip bonding equipment
- **SUSS MicroTec**: Wafer bonding for advanced packaging
- **Toray**: Substrate materials and equipment
- **Advantest**: Test equipment for ASE's test operations
- **Teradyne**: Test equipment

### Materials Suppliers
- **Substrate suppliers**: Ibiden, Shinko Electric, Kinsus, Unimicron — IC substrates are ASE's single largest material cost
- **Lead frame suppliers**: Mitsui High-tec, SDI, Chang Wah — for traditional packaging
- **Bonding wire**: Tanaka, Heraeus — gold and copper bonding wire
- **Molding compound**: Sumitomo Bakelite, Henkel, Nagase — epoxy molding compounds
- **Die attach materials**: Henkel, Alpha Metals — solder paste and adhesives
- **Thermal interface materials**: Henkel, Dow, Laird

### IP/EDA Providers
- **Cadence**: Packaging design tools (Allegro, SiP)
- **Synopsys**: 3D-IC design and verification tools
- **Mentor/Siemens EDA**: PCB and packaging design (Xpedition, Calibre)
- **ANSYS**: Thermal and mechanical simulation for packaging
- **In-house IP**: ASE develops proprietary packaging technologies (FOCoS, FOCoS-CLD, VIPack)

### OSAT/Packaging Partners
- **N/A** — ASE IS the OSAT. It is the world's largest OSAT provider.
- **Subcontracting**: ASE sometimes subcontracts overflow to smaller OSATs but this is minimal
- **Vertical integration**: ASE has moved upstream into substrate manufacturing (through subsidiaries and partnerships) to secure substrate supply

### Key Dependencies & Chokepoints
- **IC substrate supply**: The single biggest chokepoint — ABF (Ajinomoto Build-up Film) substrates from Ibiden, Shinko, Kinsus, Unimicron are capacity-constrained; ASE has invested in substrate manufacturing to mitigate
- **Advanced packaging equipment**: ASMPT and K&S are key equipment suppliers for wire bonding and die attach — limited alternatives
- **Customer concentration**: Top 10 customers (Apple, AMD, Qualcomm, Broadcom, NVIDIA, etc.) represent >50% of revenue
- **TSMC dependency**: Close partnership with TSMC for advanced packaging (InFO, CoWoS) — ASE is a key link in TSMC's 3DFabric ecosystem, but this also means dependency on TSMC's roadmap
- **Geopolitical risk**: Manufacturing concentrated in Taiwan and China; US-China tensions create relocation pressure
- **Test equipment**: Dependent on Advantest and Teradyne for test systems — these are duopoly suppliers with long lead times
- **Capital intensity**: Advanced packaging (2.5D/3D, chiplet) requires massive capex; substrate manufacturing adds further capital requirements

---

## 6. NXP Semiconductors (NXPI) — Analog Auto

### Foundry/Fab Partners
- **Own fabs**: NXP operates its own fabs — Nijmegen (300mm, automotive MCUs), Hamburg (200mm), Chandler AZ (200mm)
- **TSMC**: Strategic partner — ESMC joint venture (with Bosch, Infineon, TSMC) for Dresden fab; also TSMC for advanced nodes
- **GlobalFoundries**: Expanded partnership (2024) for next-generation 22FDX (FD-SOI) for automotive, IoT, and mobile
- **Vanguard International Semiconductor (VIS)**: Joint venture with NXP — VisionPower Semiconductor Manufacturing Company in Singapore ($7.8B, NXP 40% / VIS 60%) for 300mm wafer fab
- **Samsung Foundry**: Used for select advanced nodes

### Equipment Suppliers
- **Applied Materials**: Deposition, etch, CMP
- **ASML**: Lithography (DUV/EUV)
- **Lam Research**: Etch and deposition
- **Tokyo Electron**: CVD, etch, track
- **KLA**: Inspection and metrology

### Materials Suppliers
- **SUMCO/Siltronic**: Silicon wafers
- **Soitec**: FD-SOI wafers — critical dependency for NXP's 22FDX-based products
- **Shin-Etsu**: Wafers and photoresist
- **BASF/Merck**: Chemicals and CMP slurries
- **Air Liquide/Linde**: Specialty gases

### IP/EDA Providers
- **ARM**: Major IP partner — NXP's S32 automotive platform uses ARM Cortex cores (Cortex-R52, Cortex-M)
- **Synopsys**: Primary EDA partner — verification (ZeBu emulation), design tools, IP; selected as primary emulation provider
- **Cadence**: Design tools for analog/mixed-signal
- **CEVA**: DSP and connectivity IP (NXP acquired some CEVA-based IP)
- **Imagination Technologies**: GPU IP for automotive processors

### OSAT/Packaging Partners
- **ASE**: Long-standing OSAT partner — joint venture in Suzhou (ASE-NXP) for IC testing and packaging since 2007
- **Amkor**: Packaging services (PCN records show Amkor Philippines as qualified site)
- **In-house**: NXP maintains some backend operations but has progressively outsourced more to ASE

### Key Dependencies & Chokepoints
- **GlobalFoundries 22FDX**: Deep dependency on GF's FD-SOI process — NXP's automotive roadmap is tied to this; GF's financial stability and capacity commitment is critical
- **Soitec SOI wafers**: FD-SOI requires Soitec as essentially the sole supplier of engineered substrates — major single-source risk
- **TSMC/ESMC timeline**: ESMC Dresden fab not producing until ~2027; near-term advanced node capacity depends on TSMC Taiwan
- **VIS Singapore JV**: New fab construction (production expected ~2027) — execution risk on greenfield project
- **Automotive qualification cycles**: Automotive chips require 3-5 year qualification; switching foundry or OSAT partners is extremely difficult
- **China exposure**: Significant manufacturing and revenue exposure in China; geopolitical risk from export controls
- **ASE dependency**: Long-standing JV creates deep operational integration but also dependency on ASE's capacity and pricing

---

## Cross-Company Supply Chain Summary

| Category | Key Suppliers | Concentration Risk |
|---|---|---|
| **Foundry** | TSMC, GlobalFoundries, Samsung | TSMC dominates advanced nodes; GF critical for FD-SOI |
| **Lithography** | ASML (sole EUV supplier) | Extreme — ASML is sole source for EUV |
| **Equipment** | Applied Materials, Lam, TEL, KLA | Oligopoly; 4-5 firms control >80% |
| **Wafers** | SUMCO, Siltronic, Shin-Etsu | 3 firms control >70% of 300mm wafer supply |
| **SOI Wafers** | Soitec | Near-monopoly for engineered substrates |
| **Photoresist** | JSR, TOK, Shin-Etsu, Fujifilm | Japanese firms dominate; export control risk |
| **EDA** | Synopsys, Cadence, Siemens EDA | Duopoly+1; no real alternatives |
| **IP** | ARM | Near-monopoly for mobile/auto processor IP |
| **OSAT** | ASE, Amkor | ASE is dominant; limited alternatives for advanced packaging |
| **IC Substrates** | Ibiden, Shinko, Kinsus, Unimicron | Capacity-constrained; long lead times |
| **Test Equipment** | Advantest, Teradyne | Duopoly; 6+ month lead times in upcycles |

---

*Sources: Company press releases, annual reports, investor presentations, industry analyses. Data current as of Q1 2026.*