# Phase 3E: Supplier Chain Mapping — Batch E

## 1. Shin-Etsu Chemical (4063.T) — Materials (Silicon Wafers)

> **Note:** Shin-Etsu is itself an upstream supplier. Analysis focuses on its raw material inputs, production dependencies, and customer concentration.

### Raw Material Inputs
- **Silica/quartz rock:** High-purity silica rock sourced from select mines globally (limited geological sources). Shin-Etsu processes this into metallurgical-grade silicon, then further refines to semiconductor-grade polysilicon
- **Silicon metal:** Shin-Etsu produces silicon metal in-house from silica, which serves as feedstock for both semiconductor silicon and silicone products
- **Chlorine/caustic soda:** Key input for PVC and silicone chemistry; sourced from chemical commodity markets
- **Rare earths:** Used in magnet business (Shin-Etsu is a major rare-earth magnet producer); rare earths sourced primarily from China (critical dependency)
- **Carbon electrodes:** Used in silicon metal reduction process
- **Energy (electricity):** Silicon metal smelting and wafer production are extremely energy-intensive; Japanese and global energy costs are a major input cost

### Key Production Dependencies
- **Integrated production model:** Shin-Etsu controls the full chain from silica rock → silicon metal → semiconductor-grade polysilicon → silicon wafers. This vertical integration is a major competitive advantage
- **Energy costs:** Silicon smelting requires massive electricity; Japan's energy costs and nuclear policy directly impact margins
- **Rare earth supply from China:** ~60%+ of global rare earth mining and ~85%+ of processing is in China; Shin-Etsu's magnet division is exposed to China export controls

### Customer Concentration
- **Silicon wafers:** Top 5 customers likely account for 40-50%+ of wafer revenue (TSMC, Samsung, Intel, SK Hynix, Micron). TSMC alone is estimated at 15-20%+ of wafer segment revenue
- **PVC:** Broad customer base; less concentrated but cyclical construction/infrastructure demand
- **Silicones:** Diversified industrial customer base
- **Rare earth magnets:** Significant exposure to automotive (EV motors) and industrial customers

### Chokepoints & Risks
- **Silica rock sourcing:** Only select mines worldwide produce sufficient purity; supply is geographically constrained
- **China rare earth dependency:** Geopolitical risk of export restrictions
- **Energy costs:** Japanese electricity costs directly impact silicon metal production economics
- **Earthquake risk:** Major production in Japan (Shirakawa, Nishiki, etc.); 2011 earthquake caused months-long disruption
- **Customer concentration on TSMC/Samsung:** Any demand pullback from major foundries directly hits wafer revenue

---

## 2. Monolithic Power Systems / MPS (MPWR) — Analog Power Management

### Foundry/Fab Partners
- **TSMC:** Primary foundry partner for BCD (Bipolar-CMOS-DMOS) processes; MPS uses TSMC for the majority of its wafer production
- **Vanguard International Semiconductor (VIS):** Signed a strategic foundry agreement in Dec 2022 to diversify supply and secure capacity for power management ICs
- **Process nodes:** MPS primarily uses mature nodes (180nm–65nm BCD processes) rather than leading-edge, which provides some flexibility but still depends on limited BCD-capable foundries

### Equipment Suppliers
- **Lam Research:** Etch and deposition equipment for MPS's foundry partners
- **Applied Materials:** Deposition and CMP equipment
- **KLA:** Process control/inspection tools
- **ASML:** Lithography (though MPS uses mature nodes, less EUV dependency)
- Note: MPS is fabless — equipment is purchased by foundry partners, not directly by MPS

### Materials Suppliers
- **Silicon wafers:** Purchased by foundries (TSMC, VIS) from Shin-Etsu, SUMCO, GlobalWafers, Siltronic
- **Photoresist/chemicals:** JSR, Tokyo Ohka Kogyo (TOK), Shin-Etsu, Fujifilm — supplied to foundries
- **Copper/interconnect materials:** Honeywell, Linde (gases)

### IP/EDA Providers
- **Synopsys:** Design tools, IP blocks, verification
- **Cadence:** Analog/mixed-signal design tools (critical for MPS's power IC design flow)
- **ARM:** Processor IP for embedded MCU cores in power management SoCs
- **MPS proprietary IP:** MPS heavily leverages its own proprietary power conversion IP and process technology co-developed with foundries

### OSAT/Packaging Partners
- **ASE Group:** Primary OSAT for packaging and test
- **Amkor:** Secondary OSAT partner
- **JCET:** Used for certain package types
- MPS uses standard packaging (QFN, BGA, CSP) — no advanced packaging dependency

### Key Dependencies & Chokepoints
- **TSMC concentration:** Heavy reliance on TSMC for BCD process wafers; VIS diversification helps but TSMC remains dominant
- **Mature node capacity:** BCD processes at 180nm–65nm are in high demand for automotive/industrial; capacity can tighten
- **No in-house fab:** Complete fabless dependency; any foundry disruption directly impacts supply
- **Lead times:** Power management ICs have long qualification cycles; switching foundries is extremely difficult

---

## 3. onsemi (ON) — Analog/Sensors

### Foundry/Fab Partners
- **Internal fabs (captive):** onsemi operates its own fabs including:
  - **Bucheon, South Korea:** SiC (silicon carbide) device fab
  - **Roznov, Czech Republic:** SiC epitaxy and device fab (expanding to end-to-end SiC production)
  - **Gresham, Oregon:** Silicon power and analog fab
  - **East Fishkill, NY:** Acquired from IBM; power/SiC processing
  - **Seremban, Malaysia:** Discrete power devices
- **GlobalFoundries:** Strategic partnership for GaN power devices (announced Dec 2025); also uses GF for mature-node silicon
- **TSMC:** Used for advanced-node CMOS image sensors and certain mixed-signal products
- **Wolfspeed (formerly Cree):** Multi-year SiC wafer supply agreement (critical for SiC substrate supply)
- **SMIC:** Limited use for certain mature-node products

### Equipment Suppliers
- **Applied Materials:** Deposition, etch, CMP, ion implant
- **Lam Research:** Etch, deposition
- **KLA:** Inspection and metrology
- **ASML:** Lithography (DUV for mature nodes; some EUV for image sensors)
- **Veeco:** MOCVD equipment for SiC epitaxy
- **Axcelis Technologies:** Ion implant for SiC processing
- **Tokyo Electron:** Etch, deposition, thermal processing

### Materials Suppliers
- **SiC wafers:** Wolfspeed (primary external source); onsemi is building internal SiC substrate capability but still dependent on Wolfspeed
- **Silicon wafers:** Shin-Etsu, SUMCO, GlobalWafers (via foundry partners and internal fabs)
- **Photoresist:** JSR, TOK, Fujifilm
- **Specialty gases:** Linde, Air Liquide, Air Products
- **SiC epitaxy:** Internal (Roznov) + external suppliers

### IP/EDA Providers
- **Synopsys:** Full design suite, verification, IP
- **Cadence:** Analog/mixed-signal design tools
- **ARM:** Embedded processor IP for MCU/SoC products
- **Imagination Technologies:** GPU IP (for certain automotive SoCs)
- **onsemi proprietary IP:** Extensive SiC process and device IP; image sensor IP (from Aptina acquisition)

### OSAT/Packaging Partners
- **ASE Group:** Major OSAT partner for assembly and test
- **Amkor:** Significant partner for automotive-grade packaging
- **JCET:** Added as alternate assembly/test site (2024 PCN for DPAK packages)
- **Internal packaging:** onsemi does some packaging at its own facilities (Seremban, Malaysia; Philippines)
- **Specialized SiC packaging:** Power module packaging done both internally and at specialized partners

### Key Dependencies & Chokepoints
- **SiC wafer supply from Wolfspeed:** Critical dependency; Wolfspeed has had production issues and capacity constraints. onsemi is investing to internalize SiC substrate but transition takes years
- **Captive fab concentration:** Heavy reliance on internal fabs (Bucheon, Roznov, Gresham) — earthquake, fire, or geopolitical risk at any site is a major disruption
- **SiC yield ramp:** 8-inch SiC transition is industry-wide challenge; onsemi's timeline is aggressive
- **Automotive qualification cycles:** Long (2-3 year) qualification periods mean supply disruptions have extended impact
- **Image sensor competition:** TSMC-foundry relationship for image sensors creates competition with other TSMC customers for capacity

---

## 4. Renesas Electronics (6723.T) — Analog MCU

### Foundry/Fab Partners
- **Internal fabs (captive):**
  - **Naka Factory (Hitachinaka, Japan):** 200mm and 300mm lines for MCU/power analog
  - **Takasaki Factory:** Power semiconductor production
  - **Kofu Factory:** MCU production (transferred from Tsuruoka)
  - **Saikai Factory:** Discrete and analog
- **TSMC:** Strategic partner for advanced-node MCUs (28nm automotive MCU collaboration announced 2016; ongoing for 22nm and below)
- **GlobalFoundries:** Expanded strategic partnership (2024) for US-based manufacturing of automotive MCUs; multi-billion-dollar collaboration for 40nm and 22nm FDX process
- **SMIC:** Used for certain mature-node products
- **UMC:** Used for some mature-node production

### Equipment Suppliers
- **Applied Materials:** Deposition, etch, CMP
- **Tokyo Electron:** Etch, CVD, thermal processing (strong presence in Japan)
- **Lam Research:** Etch, deposition
- **KLA:** Inspection and metrology
- **ASML:** Lithography (DUV primarily; some EUV for advanced nodes via TSMC)
- **Hitachi High-Tech:** Inspection equipment (Japanese supplier proximity)
- **SCREEN Holdings:** Coater/developer (Japanese supplier)

### Materials Suppliers
- **Silicon wafers:** Shin-Etsu (domestic Japanese supplier — key relationship), SUMCO, GlobalWafers
- **Photoresist:** JSR, Tokyo Ohka Kogyo (TOK), Fujifilm — all Japanese suppliers with strong domestic relationships
- **Specialty gases:** Air Liquide, Linde, Showa Denko
- **CMP slurry:** Fujimi Corporation, Cabot Microelectronics
- **Bonding wire:** Tanaka Kikinzoku (Japan), Heraeus

### IP/EDA Providers
- **Synopsys:** Design tools, verification, IP (ARC processor cores)
- **Cadence:** Mixed-signal/analog design tools
- **ARM:** Cortex-M and Cortex-R IP cores (critical dependency — Renesas RA and RL families are ARM-based)
- **RISC-V:** Emerging alternative for some products (RZ/G family)
- **Andes Technology:** RISC-V IP cores for some Renesas products
- **Imagination Technologies:** GPU IP
- **Renesas proprietary IP:** Extensive analog/mixed-signal IP, automotive peripheral IP

### OSAT/Packaging Partners
- **ASE Group (ASEK Taiwan):** Major OSAT partner; multiple PCNs reference ASEK as assembly site
- **Amkor:** Significant partner for automotive-grade packaging
- **JCET:** Alternate assembly partner
- **Internal packaging:** Renesas operates some back-end operations at its own facilities in Malaysia, Thailand, and China
- **PTI (Powertech Technology):** Used for certain package types

### Key Dependencies & Chokepoints
- **ARM dependency:** Heavy reliance on ARM Cortex IP for MCU products; ARM licensing terms and roadmap directly affect Renesas product competitiveness
- **TSMC capacity for advanced MCUs:** Automotive-grade 28nm/22nm capacity at TSMC is shared with many other automotive chipmakers
- **Japan fab concentration:** Major internal fabs in Japan (Naka, Takasaki, Kofu) — earthquake risk is significant (2011 earthquake caused major disruption)
- **Automotive qualification cycles:** 3-5 year design-in cycles mean supply disruptions have very long-lasting effects
- **Dual-source strategy:** Renesas has been actively diversifying foundry sources (GF partnership) to reduce TSMC concentration risk

---

## 5. Keyence (6861.T) — Sensors/Automation

> **Note:** Keyence is a "fabless manufacturer" — it designs products and outsources all manufacturing. Analysis focuses on its contract manufacturing model and component sourcing.

### Manufacturing Model (Fabless)
- **Keyence designs all products in-house** but outsources 100% of manufacturing to contract manufacturers
- Keyence deliberately keeps supplier identities confidential and fragments production across multiple contractors to prevent any single supplier from gaining leverage or copying products
- No single contract manufacturer accounts for a dominant share of production
- This model is a core competitive advantage — enables 55%+ operating margins with minimal CapEx

### Foundry/Fab Partners (for sensor ICs)
- **Not publicly disclosed** — Keyence sources custom ICs through foundries but keeps relationships confidential
- Likely uses: **TSMC, Rohm, Panasonic (now Nuvia), Sony Semiconductor** for custom sensor ICs
- Keyence's sensor ICs are typically on mature nodes (not leading-edge)

### Equipment Suppliers (for Keyence's contract manufacturers)
- Keyence does not purchase semiconductor equipment directly
- Contract manufacturers use standard equipment from: **Applied Materials, Lam Research, KLA, ASML, Tokyo Electron, SCREEN**

### Materials Suppliers (for Keyence's contract manufacturers)
- Keyence sources components for its products through its own procurement (separate from foundry materials):
  - **Optical components:** Lenses, LEDs, laser diodes from Japanese and global suppliers
  - **Electronic components:** Passive components, connectors from multiple sources
  - **Mechanical components:** Precision machined parts from Japanese SMEs
  - Keyence actively solicits new suppliers through its "Supplying to KEYENCE" portal

### IP/EDA Providers
- **Not publicly disclosed** — Keyence keeps design tool choices confidential
- Likely uses: **Synopsys, Cadence** for IC design
- **Proprietary IP:** Keyence's core value is its proprietary sensor algorithms, measurement techniques, and application know-how — not licensed IP

### OSAT/Packaging Partners
- **Not publicly disclosed** — contract manufacturers handle packaging
- Likely uses: **ASE, Amkor, and Japanese OSAT providers** through contract manufacturing arrangements

### Key Dependencies & Chokepoints
- **Contract manufacturer concentration risk:** Despite diversification, Keyence depends on a network of primarily Japanese and Asian contract manufacturers. Regional disruption (earthquake, pandemic) could affect multiple suppliers simultaneously
- **Component sourcing for specialized optics/lasers:** Keyence uses high-performance laser diodes, CMOS sensors, and optical components that may have limited alternative sources
  - **Sony** for image sensors (potential single-source risk)
  - **Japanese laser diode suppliers** (potentially Rohm, Sharp)
- **No in-house manufacturing capability:** Complete dependency on external production; cannot quickly ramp or pivot without contractor cooperation
- **Intellectual property leakage risk:** Outsourcing production inherently risks design leakage; Keyence mitigates by fragmenting production and not giving any single contractor the complete product
- **Customer concentration:** ~50%+ revenue from Japan; heavy exposure to Japanese manufacturing capex cycles
- **High-margin model sustainability:** 55%+ operating margins depend on continued product differentiation; any commoditization would compress margins significantly

---

## 6. Western Digital (WDC) — Memory NAND/HDD

### Foundry/Fab Partners (NAND Flash)
- **Kioxia (Joint Venture):** WDC and Kioxia operate a joint venture ("Flash Partners") that owns/manages NAND fabrication facilities at Yokkaichi, Japan
  - **Fab 6:** 3D NAND production (operational)
  - **Fab 7:** Opened Oct 2022; expanding 3D NAND capacity
  - **Fab 8 (Kitakami):** Under construction; received ¥150B Japanese government subsidy (Feb 2024)
  - WDC and Kioxia split output roughly 50/50 from the JV fabs
- **No independent NAND fab:** WDC has no standalone NAND manufacturing — 100% dependent on Kioxia JV for NAND flash production

### Foundry/Fab Partners (HDD)
- **Internal HDD manufacturing:** WDC operates its own HDD assembly facilities
  - **Bangkok, Thailand:** Major HDD assembly
  - **Korat, Thailand:** HDD assembly
  - **Penang, Malaysia:** HDD assembly
- **Head manufacturing:** WDC acquired Komag (2007) for magnetic media and operates head manufacturing (historically acquired from IBM/Hitachi facilities)

### Equipment Suppliers
- **Applied Materials:** Deposition equipment for NAND fab
- **Lam Research:** Etch equipment (critical for 3D NAND vertical etch)
- **KLA:** Inspection and metrology
- **ASML:** Lithography (DUV for NAND; EUV for future nodes)
- **Tokyo Electron:** CVD, etch, thermal processing
- **Veeco:** MOCVD and ion beam equipment
- **HDD-specific equipment:** Specialized magnetic media sputtering equipment (some proprietary/custom)

### Materials Suppliers
- **Silicon wafers:** Shin-Etsu, SUMCO (for NAND production at JV fabs)
- **Photoresist:** JSR, TOK, Fujifilm
- **Specialty gases:** Linde, Air Liquide, Air Products
- **Magnetic media (HDD):** WDC acquired Hoya's magnetic media sputtering operations (2010) and Komag (2007) — now largely internal
- **Rare earths (HDD):** Neodymium and other rare earths for HDD magnets; sourced from China (geopolitical risk)
- **CMP consumables:** Fujimi, Cabot Microelectronics

### IP/EDA Providers
- **Synopsys:** Design tools for NAND controller and HDD SoC design
- **Cadence:** Verification and implementation tools
- **ARM:** Processor IP for NAND flash controllers and HDD SoCs
- **WDC proprietary IP:** Extensive NAND flash controller firmware, HDD head technology, signal processing algorithms

### OSAT/Packaging Partners
- **ASE Group:** Major OSAT for SSD controller packaging
- **Amkor:** NAND flash and controller packaging
- **JCET:** Alternate packaging partner
- **Internal:** WDC does significant packaging/assembly for HDD products at its Thailand/Malaysia facilities

### Key Dependencies & Chokepoints
- **Kioxia JV dependency:** This is the single biggest structural risk. WDC has no independent NAND manufacturing capability. The JV structure means:
  - WDC cannot unilaterally make fab investment decisions
  - Kioxia's financial health directly affects WDC's NAND supply
  - Kioxia IPO plans and potential M&A (SK Hynix interest, Bain Capital ownership) create uncertainty
  - JV output split means WDC gets ~50% of fab output — if demand exceeds supply, WDC cannot easily get more
- **Yokkaichi earthquake risk:** All NAND fabs are in Yokkaichi, Japan (Mie Prefecture). A major earthquake could disable all NAND production simultaneously
- **HDD head technology:** WDC designs and manufactures its own recording heads — this is a highly specialized capability with limited alternative sources
- **NAND market cyclicality:** NAND flash is highly cyclical; WDC's profitability swings dramatically with NAND pricing
- **China rare earth dependency:** HDD magnets require rare earths predominantly sourced from China
- **SSD competition:** Growing SSD adoption (including WDC's own) cannibalizes HDD demand; WDC must balance both businesses
- **3D NAND technology race:** WDC/Kioxia compete with Samsung, SK Hynix, and Micron in 3D NAND layer stacking; falling behind in layer count (currently ~200+ layers) would be competitive disaster

---

## Cross-Company Dependency Summary

| Dependency | Shin-Etsu | MPWR | onsemi | Renesas | Keyence | WDC |
|---|---|---|---|---|---|---|
| **TSMC** | Customer | Primary foundry | Partial foundry | Key foundry | Indirect | Indirect |
| **Shin-Etsu wafers** | — | Via foundries | Direct + via foundries | Direct | Indirect | Via JV |
| **ARM IP** | N/A | Minor | Moderate | Critical | Minor | Moderate |
| **ASE/Amkor OSAT** | N/A | Primary | Primary | Primary | Indirect | Primary |
| **Applied Materials** | Customer | Via foundries | Direct + via foundries | Direct + via foundries | Indirect | Via JV |
| **Japan earthquake** | High risk | Indirect | Moderate | High risk | Moderate | High risk |
| **China rare earths** | High risk | Low | Low | Low | Low | Moderate |
| **Energy costs** | Critical | Low | Moderate | Moderate | Low | Moderate |

### Key Systemic Risks Across Batch E
1. **Japan earthquake cluster:** Shin-Etsu, Renesas, and WDC/Kioxia all have major production in Japan — a single seismic event could disrupt multiple companies simultaneously
2. **TSMC concentration:** MPWR, onsemi, and Renesas all depend on TSMC for critical products; TSMC capacity allocation decisions affect all three
3. **Kioxia JV fragility:** WDC's entire NAND supply depends on a JV with a financially weaker partner — this is the most concentrated single dependency in the group
4. **ARM ecosystem dependency:** Renesas is most exposed, but MPWR and WDC also rely on ARM IP for controller/MCU designs
5. **Mature node capacity:** MPWR and Renesas both compete for BCD/mature-node capacity that is in high demand for automotive applications