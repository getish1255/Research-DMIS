import { ResearchActivity } from '../types';
import { NATURAL_RESOURCES_ACTIVITIES } from './naturalResourcesActivitiesData';
import { LIVESTOCK_ACTIVITIES } from './livestockActivitiesData';
import { COMPLETED_ACTIVITIES } from './completedActivitiesData';

export const BASE_ACTIVITIES: ResearchActivity[] = [
  {
    id: 'act-001',
    code: 'IQQO-CRD-SIN-2025-01',
    title: 'Breeding for High-Yielding and Stem Rust (Ug99) Resistant Durum Wheat Varieties for Bale Highlands',
    centerId: 'sinana-arc',
    directorateId: 'crop-research',
    teamId: 'team-cereal-crops',
    status: 'Ongoing',
    progressPercent: 78,
    principalInvestigator: 'Dr. Gemechu Keneni',
    piEmail: 'gemechu.k@iqqo.gov.et',
    collaborators: ['Dr. Bekele Hundie (Pathology)', 'Ato Worku Tesso (Agronomy)'],
    fiscalYear: 2025,
    startDate: '2024-06-15',
    endDate: '2026-11-30',
    budgetAllocatedETB: 1450000,
    budgetUtilizedETB: 1120000,
    objectives: [
      'Evaluate 45 advanced durum wheat lines for Sr2, Sr33, and Sr35 resistance genes against emerging Ug99 stem rust lineage variants.',
      'Assess grain quality parameters (protein content >13%, yellow pigment index >8.5) required by Ethiopian pasta and semolina processing industries.',
      'Identify and submit top 2 elite candidate varieties to the National Variety Release Standing Committee.'
    ],
    methodology: 'Multi-location randomized complete block design (RCBD) across Sinana, Robe, and Agarfa experimental sub-stations with artificial rust inoculation nurseries.',
    expectedOutputs: 'Two high-yielding durum wheat varieties with yield advantage >18% over standard check (Utuba), published technical release proposal.',
    targetAgroEcology: 'Highland (2400m - 2650m a.s.l)',
    milestones: [
      { id: 'm-101', title: 'Parental hybridization and F3 generation phenotypic screening', dueDate: '2024-12-15', completed: true, completedDate: '2024-12-10', deliverableSummary: '45 promising homozygous lines retained.' },
      { id: 'm-102', title: 'Multi-location yield trial and artificial stem rust nursery evaluation', dueDate: '2025-10-30', completed: true, completedDate: '2025-10-24', deliverableSummary: 'Candidate lines SARC-DW-22 and SARC-DW-29 showed 0S infection response.' },
      { id: 'm-103', title: 'Industrial semolina mill quality testing at Addis Ababa food lab', dueDate: '2026-04-15', completed: false },
      { id: 'm-104', title: 'National Variety Release Technical Dossier Submission', dueDate: '2026-11-15', completed: false }
    ],
    deliverables: [
      { id: 'd-101', title: 'Field Day Demonstration Booklet for Bale Highland Wheat Farmers', type: 'Technical Manual', status: 'Published', date: '2025-10-18' },
      { id: 'd-102', title: 'Candidate Durum Line SARC-DW-22 National Verification Submission', type: 'Variety Release', status: 'Submitted', date: '2026-02-14' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-03-28'
  },
  {
    id: 'act-002',
    code: 'IQQO-LRD-HOL-2024-03',
    title: 'Standardization and Dissemination of Modern Queen Bee Mass Rearing Technology for Smallholder Beekeepers',
    centerId: 'holeta-bee',
    directorateId: 'livestock-research',
    teamId: 'team-apiculture-sericulture',
    status: 'Completed',
    progressPercent: 100,
    principalInvestigator: 'Dr. Taye Beyene',
    piEmail: 'taye.beyene@iqqo.gov.et',
    collaborators: ['Mrs. Aster Yohannes (Apiary Specialist)', 'Ato Girma Debele (Technician)'],
    fiscalYear: 2024,
    startDate: '2023-03-01',
    endDate: '2025-06-30',
    budgetAllocatedETB: 890000,
    budgetUtilizedETB: 875000,
    objectives: [
      'Adapt Doolittle grafting method for Apis mellifera bandasi under highland climatic constraints.',
      'Produce >1,200 mated pedigree queens annually with docile and high-honey hoarding genetic traits.',
      'Train 180 youth and women honey producers across West Shewa and Finfinne Special Zones.'
    ],
    methodology: 'Controlled nurse colonies with optimal larval priming diets, incubator temperature regulation at 34.5°C, and mini-plus mating nuc tracking.',
    expectedOutputs: 'Verified queen rearing manual in Afaan Oromoo and Amharic, established commercial nursery hub at Holeta.',
    targetAgroEcology: 'Highland (2000m - 2400m a.s.l)',
    milestones: [
      { id: 'm-201', title: 'Evaluation of wooden vs wax cell cups for grafting acceptance', dueDate: '2023-08-30', completed: true, completedDate: '2023-08-20', deliverableSummary: 'Wax cups yielded 86% acceptance rate.' },
      { id: 'm-202', title: 'Mini-mating nuc survival trials in cold rainy season', dueDate: '2024-04-15', completed: true, completedDate: '2024-04-10', deliverableSummary: 'Insulated polystyrene covers increased survival by 24%.' },
      { id: 'm-203', title: 'Mass farmer training and kit distribution', dueDate: '2025-05-30', completed: true, completedDate: '2025-05-25', deliverableSummary: '194 beekeepers certified.' }
    ],
    deliverables: [
      { id: 'd-201', title: 'Queen Bee Rearing Technical Guide for Oromia Beekeepers', type: 'Technical Manual', status: 'Published', date: '2024-11-12' },
      { id: 'd-202', title: 'Journal of Apicultural Research: Queen Rearing Protocol in Ethiopian Highlands', type: 'Journal Publication', status: 'Published', date: '2025-06-15' }
    ],
    extensionHistory: [],
    lastUpdated: '2025-07-02'
  },
  {
    id: 'act-003',
    code: 'IQQO-LRD-BAT-2025-02',
    title: 'Selective Breeding and Pond Nursery Optimization of Nile Tilapia (Oreochromis niloticus) in Lake Zeway Basin',
    centerId: 'batu-fishery',
    directorateId: 'livestock-research',
    teamId: 'team-fisheries-aquaculture',
    status: 'Ongoing',
    progressPercent: 62,
    principalInvestigator: 'Dr. Megersa Endebu',
    piEmail: 'megersa.e@iqqo.gov.et',
    collaborators: ['Ato Alemayehu Abebe (Limnologist)', 'Ato Fikadu Negassa (Hatchery Manager)'],
    fiscalYear: 2025,
    startDate: '2024-09-01',
    endDate: '2026-12-31',
    budgetAllocatedETB: 1200000,
    budgetUtilizedETB: 740000,
    objectives: [
      'Establish second generation (F2) breeding families with fast daily weight gain (>2.5g/day).',
      'Formulate cost-effective floating aqua-feed using local brewery spent grains and abattoir blood meal.',
      'Reduce juvenile fingerling mortality rate from 35% to below 12% in concrete nursery tanks.'
    ],
    methodology: 'Hapas-in-ponds selective breeding design with PIT-tag individual identification and controlled photoperiod incubators.',
    expectedOutputs: 'Fast-growing strain adapted to Rift Valley alkaline water conditions, disseminated 250,000 certified fingerlings to youth cooperatives.',
    targetAgroEcology: 'Lowland (1600m a.s.l)',
    milestones: [
      { id: 'm-301', title: 'Broodstock collection and genetic polymorphism baseline profiling', dueDate: '2025-01-30', completed: true, completedDate: '2025-01-20', deliverableSummary: '300 wild and domesticated founders tagged.' },
      { id: 'm-302', title: 'Local ingredient feed pelting trial and digestibility analysis', dueDate: '2025-11-15', completed: true, completedDate: '2025-11-10', deliverableSummary: '28% crude protein pellet achieved FCR of 1.45.' },
      { id: 'm-303', title: 'On-farm validation trials in 12 community fish ponds in East Shewa', dueDate: '2026-08-30', completed: false }
    ],
    deliverables: [
      { id: 'd-301', title: 'Low-Cost Fish Feed Formulation Manual from Agro-Industrial Byproducts', type: 'Technical Manual', status: 'Draft', date: '2025-12-05' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-03-15'
  },
  {
    id: 'act-004',
    code: 'IQQO-NRD-NEK-2024-05',
    title: 'Integrated Soil Acidity Management Using Fine-Crushed Agricultural Lime and Bio-fertilizers in Western Oromia',
    centerId: 'nekemte-soil',
    directorateId: 'natural-resources',
    teamId: 'team-soil-fertility-health',
    status: 'Extended',
    progressPercent: 70,
    principalInvestigator: 'Dr. Belaynesh Zeleke',
    piEmail: 'belaynesh.z@iqqo.gov.et',
    collaborators: ['Ato Tolera Dabesa (Agronomist)', 'Dr. Hailu Shiferaw (Soil Scientist)'],
    fiscalYear: 2024,
    startDate: '2023-05-01',
    endDate: '2026-09-30',
    budgetAllocatedETB: 1650000,
    budgetUtilizedETB: 1390000,
    objectives: [
      'Calibrate agricultural lime requirement index based on exchangeable acidity (Al3+ and H+) for Diga and Sasiga districts.',
      'Determine synergy of combined lime + Bradyrhizobium inoculation + inorganic phosphorus on soybean and maize yields.',
      'Develop digital soil acidity risk atlas for East Wollega zone.'
    ],
    methodology: 'Multi-year farm field experiments replicated across 18 micro-watersheds with varying slope gradients and initial pH values (4.2 - 5.1).',
    expectedOutputs: 'Zone-specific liming recommendation guidelines that reduce lime expenditure by 30% through targeted band placement.',
    targetAgroEcology: 'Midland Sub-humid (1800m - 2100m a.s.l)',
    milestones: [
      { id: 'm-401', title: 'Baseline soil sampling and exchangeable acidity GIS grid mapping', dueDate: '2023-11-30', completed: true, completedDate: '2023-11-20', deliverableSummary: '640 geo-referenced soil samples analyzed.' },
      { id: 'm-402', title: 'Second year residual lime efficacy trial on maize test crop', dueDate: '2024-12-15', completed: true, completedDate: '2024-12-12', deliverableSummary: 'Yield doubled from 2.1 t/ha to 4.8 t/ha with 2.5 t/ha lime.' },
      { id: 'm-403', title: 'Soybean nodulation assay with indigenous rhizobial isolates', dueDate: '2025-10-30', completed: true, completedDate: '2025-10-25' },
      { id: 'm-404', title: 'Finalized liming decision support tool validation', dueDate: '2026-08-30', completed: false }
    ],
    deliverables: [
      { id: 'd-401', title: 'Western Oromia Acid Soil Liming Protocol & Decision Chart', type: 'Policy Brief', status: 'Submitted', date: '2025-11-04' }
    ],
    extensionHistory: [
      {
        id: 'ext-001',
        requestedMonths: 6,
        previousEndDate: '2026-03-31',
        newEndDate: '2026-09-30',
        justification: 'Severe road infrastructure disruptions in Kellem Wollega delayed delivery of specialized analytical laboratory reagents for heavy metal and exchangeable cation analysis.',
        requestedBy: 'Dr. Belaynesh Zeleke',
        requestDate: '2026-01-10',
        status: 'Approved',
        reviewedBy: 'Institutional RRC',
        reviewDate: '2026-01-18',
        reviewNotes: 'Approved by Institutional RRC to allow complete residual harvest data collection for the Meher season.'
      }
    ],
    lastUpdated: '2026-03-20'
  },
  {
    id: 'act-005',
    code: 'IQQO-AER-ASE-2025-01',
    title: 'Design, Fabrication, and Field Testing of Multi-Crop Power-Tiller Mounted Seed Planter for Smallholders',
    centerId: 'asela-eng',
    directorateId: 'agricultural-engineering',
    teamId: 'team-farm-mechanization',
    status: 'Ongoing',
    progressPercent: 55,
    principalInvestigator: 'Eng. Solomon Worku',
    piEmail: 'solomon.worku@iqqo.gov.et',
    collaborators: ['Eng. Tamirat Geda (Mechanical Engineer)', 'Ato Bekele Dida (Draftsman)'],
    fiscalYear: 2025,
    startDate: '2024-10-01',
    endDate: '2026-10-31',
    budgetAllocatedETB: 1100000,
    budgetUtilizedETB: 610000,
    objectives: [
      'Design an adaptable inclined-plate seed metering mechanism for teff, wheat, and haricot beans compatible with 8-12 HP two-wheel walking tractors.',
      'Achieve seed damage rate <1.5% and uniform seeding depth (2cm - 4cm).',
      'Test field working capacity (>0.35 ha/hour) on terraced highland farms in Arsi Zone.'
    ],
    methodology: 'SolidWorks 3D CAD modeling, CNC laser prototype manufacturing at Asela workshop, followed by soil bin and field agronomic trials.',
    expectedOutputs: 'Commercial manufacturing blueprint, certified prototype ready for local small-scale workshop fabrication.',
    targetAgroEcology: 'Highland / Midland (2200m a.s.l)',
    milestones: [
      { id: 'm-501', title: 'CAD structural stress simulation and metering plate calibration', dueDate: '2025-03-31', completed: true, completedDate: '2025-03-15', deliverableSummary: 'Inclined nylon disc selected for teff.' },
      { id: 'm-502', title: 'First metal prototype assembly and stationary test bench validation', dueDate: '2025-09-30', completed: true, completedDate: '2025-09-20', deliverableSummary: 'Achieved 97% seed spacing regularity.' },
      { id: 'm-503', title: 'Field trial on wheat planting in Arsi Robe farmers association', dueDate: '2026-06-30', completed: false }
    ],
    deliverables: [
      { id: 'd-501', title: 'CAD Drawing Package & Manufacturing Specifications for 2WT Planter', type: 'Patent / Prototype', status: 'Draft', date: '2025-10-12' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-02-18'
  },
  {
    id: 'act-006',
    code: 'IQQO-CRD-BAK-2023-02',
    title: 'Breeding for Drought-Tolerant and Low-Nitrogen Efficient White Maize Hybrids for Sub-Humid Midlands',
    centerId: 'bako-arc',
    directorateId: 'crop-research',
    teamId: 'team-cereal-crops',
    status: 'Completed',
    progressPercent: 100,
    principalInvestigator: 'Dr. Berhanu Mengistu',
    piEmail: 'berhanu.m@iqqo.gov.et',
    collaborators: ['Dr. Dagne Wegary (Maize Breeder)', 'Ato Solomon Admassu (Agronomist)'],
    fiscalYear: 2023,
    startDate: '2022-04-01',
    endDate: '2025-04-30',
    budgetAllocatedETB: 2100000,
    budgetUtilizedETB: 2040000,
    objectives: [
      'Evaluate 36 single-cross maize hybrids under induced managed water stress during anthesis.',
      'Screen lines under zero-nitrogen depleted trial plots to select for high nutrient use efficiency.',
      'Release a three-way cross hybrid outyielding BH546 by at least 15% under drought stress.'
    ],
    methodology: 'Alpha lattice design with 3 replications across Bako, Bako-Engineering, and Billo sub-sites.',
    expectedOutputs: 'Commercial registration of Bako Hybrid BH-661 with resistance to Turcicum leaf blight and grey leaf spot.',
    targetAgroEcology: 'Midland Sub-humid (1650m a.s.l)',
    milestones: [
      { id: 'm-601', title: 'National maize preliminary yield trial (PYT) completion', dueDate: '2022-12-15', completed: true, completedDate: '2022-12-05' },
      { id: 'm-602', title: 'National variety trial across 8 research stations in Ethiopia', dueDate: '2023-11-30', completed: true, completedDate: '2023-11-20' },
      { id: 'm-603', title: 'Release dossier defense before National Release Committee', dueDate: '2024-05-20', completed: true, completedDate: '2024-05-18', deliverableSummary: 'Officially released as "BH-661 (Gudatu)".' }
    ],
    deliverables: [
      { id: 'd-601', title: 'BH-661 (Gudatu) Maize Variety Official National Release Gazette', type: 'Variety Release', status: 'Certified', date: '2024-06-01' },
      { id: 'd-602', title: 'Euphytica Journal: Genetic Gain in Maize Yield under Low Nitrogen Stress in Western Ethiopia', type: 'Journal Publication', status: 'Published', date: '2025-03-10' }
    ],
    extensionHistory: [],
    lastUpdated: '2025-05-10'
  },
  {
    id: 'act-007',
    code: 'IQQO-LRD-YAB-2025-04',
    title: 'Characterization of Camel Milk Fermentation Microbiota and Value-Added Dairy Products in Borana Pastoralists',
    centerId: 'yabalo-pastoral',
    directorateId: 'food-science',
    teamId: 'team-postharvest-processing',
    status: 'Ongoing',
    progressPercent: 45,
    principalInvestigator: 'Dr. Guyo Roba',
    piEmail: 'guyo.roba@iqqo.gov.et',
    collaborators: ['Dr. Yetenayet Tola (Food Technologist)', 'Ato Galgallo Doyo (Sociologist)'],
    fiscalYear: 2025,
    startDate: '2025-01-15',
    endDate: '2027-01-31',
    budgetAllocatedETB: 1350000,
    budgetUtilizedETB: 580000,
    objectives: [
      'Isolate and identify probiotic lactic acid bacteria from traditionally smoked traditional Ititu camel milk.',
      'Develop a standardized starter culture yielding consistent pH, aroma, and microbiological safety without spontaneous spoilage.',
      'Design a solar-powered cooler prototype for pastoral milk collection centers around Yabalo and Moyale.'
    ],
    methodology: 'Microbial sequencing (16S rRNA gene profiling) at HQ biotechnology center and field fermentation trials with pastoralist women groups.',
    expectedOutputs: 'Certified probiotic starter culture, enhanced shelf-life pasteurized camel milk product with 21-day storage stability.',
    targetAgroEcology: 'Pastoral / Arid (1300m - 1700m a.s.l)',
    milestones: [
      { id: 'm-701', title: 'Field collection of 120 traditional Ititu milk ferment samples from Borana pastoralists', dueDate: '2025-06-30', completed: true, completedDate: '2025-06-20', deliverableSummary: 'Samples collected and transported in liquid nitrogen.' },
      { id: 'm-702', title: 'Isolation and biochemical characterization of 45 Lactobacillus and Lactococcus strains', dueDate: '2025-12-15', completed: true, completedDate: '2025-12-05', deliverableSummary: 'Strains isolated and preserved.' },
      { id: 'm-703', title: 'Formulation of lyophilized starter culture sachet', dueDate: '2026-07-30', completed: false }
    ],
    deliverables: [
      { id: 'd-701', title: 'Quality & Hygienic Handling Guidelines for Camel Milk in Pastoral Oromia', type: 'Technical Manual', status: 'Draft', date: '2026-02-28' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-03-24'
  },
  {
    id: 'act-008',
    code: 'IQQO-CPD-ADA-2024-02',
    title: 'Integrated Management of Tuta absoluta and Onion Thrips Using Entomopathogenic Fungi in Central Rift Valley',
    centerId: 'adami-tulu',
    directorateId: 'crop-protection',
    teamId: 'team-entomology-weeds',
    status: 'Ongoing',
    progressPercent: 82,
    principalInvestigator: 'Dr. Teshale Wolde',
    piEmail: 'teshale.w@iqqo.gov.et',
    collaborators: ['Dr. Habtamu Kaba (Entomologist)', 'Ato Bedilu Tufa (Horticulturist)'],
    fiscalYear: 2024,
    startDate: '2024-02-01',
    endDate: '2026-06-30',
    budgetAllocatedETB: 1250000,
    budgetUtilizedETB: 1020000,
    objectives: [
      'Screen indigenous Beauveria bassiana and Metarhizium anisopliae fungal isolates against Tuta absoluta larvae.',
      'Formulate oil-based fungal biopesticide spray for Rift Valley commercial tomato and onion fields.',
      'Reduce synthetic organophosphate pesticide sprays by 60% while maintaining marketable bulb and fruit yields.'
    ],
    methodology: 'Bioassay laboratory mortality trials followed by split-plot randomized field plots at Adami Tulu and Batu research stations.',
    expectedOutputs: 'Commercial biopesticide formulation recipe and IPM package registered with the Ministry of Agriculture.',
    targetAgroEcology: 'Lowland Semi-Arid (1650m a.s.l)',
    milestones: [
      { id: 'm-801', title: 'Local isolate pathogenicity screening against 2nd instar larvae', dueDate: '2024-07-30', completed: true, completedDate: '2024-07-15', deliverableSummary: 'Isolate Bb-AT04 achieved 89% mortality within 96 hours.' },
      { id: 'm-802', title: 'Dry season irrigated tomato field validation trial', dueDate: '2025-03-31', completed: true, completedDate: '2025-03-22', deliverableSummary: 'Infestation dropped from 72% to 14%.' },
      { id: 'm-803', title: 'Farmer Field School multi-locational demonstration in Meki', dueDate: '2026-05-15', completed: false }
    ],
    deliverables: [
      { id: 'd-801', title: 'IPM Guide for Rift Valley Horticultural Farmers', type: 'Technical Manual', status: 'Published', date: '2025-08-14' },
      { id: 'd-802', title: 'Crop Protection Journal: Biocontrol of Tuta absoluta using Native Beauveria Strains', type: 'Journal Publication', status: 'Submitted', date: '2026-01-20' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-03-10'
  },
  {
    id: 'act-009',
    code: 'IQQO-CTD-BED-2025-01',
    title: 'Selection and Morphological Characterization of Acid-Tolerant High-Quality Tea Clones in Bedele',
    centerId: 'bedele-arc',
    directorateId: 'coffee-tea',
    teamId: 'team-tea-production',
    status: 'Ongoing',
    progressPercent: 50,
    principalInvestigator: 'Dr. Fikru Tamiru',
    piEmail: 'fikru.t@iqqo.gov.et',
    collaborators: ['Ato Alemayehu Chala (Tea Breeder)', 'Ato Senbeto Tolesa (Agronomist)'],
    fiscalYear: 2025,
    startDate: '2024-07-01',
    endDate: '2027-06-30',
    budgetAllocatedETB: 1500000,
    budgetUtilizedETB: 720000,
    objectives: [
      'Evaluate 24 newly collected tea germplasm accessions for vegetative vigour, plucking density, and made-tea liquor quality.',
      'Determine tolerance thresholds to high aluminium saturation in acidic soils (pH <4.5).',
      'Propagate 50,000 elite tea rooted cuttings for out-grower tea farmers in Buno Bedele.'
    ],
    methodology: 'Longitudinal vegetative trial with sensory cupping panel evaluation at Ethiopian Tea Processing Authority laboratory.',
    expectedOutputs: 'Release of 2 high-polyphenol green and black tea clones with green leaf yield >12 t/ha.',
    targetAgroEcology: 'Midland Humid (1900m a.s.l)',
    milestones: [
      { id: 'm-901', title: 'Germplasm nursery establishment and vegetative survival count', dueDate: '2024-12-30', completed: true, completedDate: '2024-12-18', deliverableSummary: '94% rooting achieved under shade tunnels.' },
      { id: 'm-902', title: 'First round pruning and plucking shoot density measurement', dueDate: '2025-10-31', completed: true, completedDate: '2025-10-20' },
      { id: 'm-903', title: 'Sensory cupping and biochemical catechins content assay', dueDate: '2026-08-30', completed: false }
    ],
    deliverables: [
      { id: 'd-901', title: 'Tea Nursery Management Handbook in Afaan Oromoo', type: 'Technical Manual', status: 'Published', date: '2025-04-10' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-02-12'
  },
  {
    id: 'act-010',
    code: 'IQQO-CRD-FIT-2026-01',
    title: 'Breeding for Vertisol-Drainage Resilient and Lodging Resistant Teff Lines in North Shewa Highlands',
    centerId: 'fitche-arc',
    directorateId: 'crop-research',
    teamId: 'team-cereal-crops',
    status: 'New',
    progressPercent: 10,
    principalInvestigator: 'Dr. Alemayehu Gurmu',
    piEmail: 'alemayehu.g@iqqo.gov.et',
    collaborators: ['Ato Hailu Keneni (Breeder)', 'Mrs. Meseret Desta (Soil Agronomist)'],
    fiscalYear: 2026,
    startDate: '2026-03-01',
    endDate: '2028-12-31',
    budgetAllocatedETB: 1800000,
    budgetUtilizedETB: 150000,
    objectives: [
      'Screen 80 recombinant inbred lines (RILs) derived from Quncho x Magna crosses for stem culm thickness and lodging index.',
      'Integrate Broadbed Maker (BBM) mechanized drainage with precision fertilizer micro-dosing on heavy waterlogged Vertisols.',
      'Identify candidate lines providing >2.8 t/ha grain yield on waterlogged soils without lodging.'
    ],
    methodology: 'Multi-environment yield trials with electronic lodging angle logging and digital image analysis of canopy architecture.',
    expectedOutputs: 'Dossier for lodging-resistant teff variety suitable for mechanized combine harvesting.',
    targetAgroEcology: 'Highland Vertisol (2700m a.s.l)',
    milestones: [
      { id: 'm-1001', title: 'Procurement of foundation seed and soil characterization of trial plots', dueDate: '2026-05-30', completed: true, completedDate: '2026-03-25', deliverableSummary: 'Soil Vertisol clay content tested at 68%.' },
      { id: 'm-1002', title: 'First Meher season planting and emergence counting', dueDate: '2026-09-30', completed: false },
      { id: 'm-1003', title: 'Lodging score evaluation after heavy highland rainstorms', dueDate: '2026-11-30', completed: false }
    ],
    deliverables: [],
    extensionHistory: [],
    lastUpdated: '2026-03-26'
  },
  {
    id: 'act-011',
    code: 'IQQO-BIO-HQ-2025-02',
    title: 'High-Throughput In-Vitro Micropropagation and Disease Indexing of Elite Seed Sweet Potato & Irish Potato',
    centerId: 'iqqo-hq',
    directorateId: 'biotechnology',
    teamId: 'team-plant-tissue-culture',
    status: 'Ongoing',
    progressPercent: 72,
    principalInvestigator: 'Dr. Dereje Beyene',
    piEmail: 'dereje.b@iqqo.gov.et',
    collaborators: ['Dr. Alemitu Mideksa (Horticulture)', 'Mrs. Martha Bekele (Lab Technologist)'],
    fiscalYear: 2025,
    startDate: '2024-05-01',
    endDate: '2026-11-30',
    budgetAllocatedETB: 1750000,
    budgetUtilizedETB: 1280000,
    objectives: [
      'Eliminate Sweet Potato Feathery Mottle Virus (SPFMV) and Potato Virus Y (PVY) using apical meristem tip culture and thermotherapy.',
      'Produce 150,000 verified virus-free in-vitro plantlets for regional seed multiplication centers at Bore and Adami Tulu.',
      'Optimize low-cost liquid culture bioreactors to reduce plantlet unit cost by 40%.'
    ],
    methodology: 'DAS-ELISA and RT-PCR virus indexing in biosafety certified tissue culture facilities at IQQO central laboratory.',
    expectedOutputs: 'Clean foundation mother stocks distributed to 4 regional tissue culture satellite nurseries.',
    targetAgroEcology: 'Headquarters / All Agro-ecologies',
    milestones: [
      { id: 'm-1101', title: 'Thermotherapy treatment of infected field cuttings at 38°C', dueDate: '2024-09-30', completed: true, completedDate: '2024-09-20', deliverableSummary: '0.2mm meristem excised successfully.' },
      { id: 'm-1102', title: 'Molecular RT-PCR verification of viral absence', dueDate: '2025-04-15', completed: true, completedDate: '2025-04-05', deliverableSummary: 'Confirmed 100% negative for PVY and SPFMV.' },
      { id: 'm-1103', title: 'Acclimatization of 80,000 plantlets in net houses', dueDate: '2025-12-15', completed: true, completedDate: '2025-12-10' },
      { id: 'm-1104', title: 'Distribution to Bore and Adami Tulu multiplication centers', dueDate: '2026-08-30', completed: false }
    ],
    deliverables: [
      { id: 'd-1101', title: 'Standard Operating Procedure (SOP) for Virus-Free In-Vitro Root Crop Multiplication', type: 'Technical Manual', status: 'Published', date: '2025-06-22' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-03-12'
  },
  {
    id: 'act-012',
    code: 'IQQO-CRD-HAR-2023-01',
    title: 'Development of Non-Shattering and High-Oil Sesame Varieties for Western Lowlands of Haro-Sabu',
    centerId: 'haro-sabu',
    directorateId: 'crop-research',
    teamId: 'team-pulses-oilseeds',
    status: 'Discontinued',
    progressPercent: 35,
    principalInvestigator: 'Mr. Tolasa Bayisa',
    piEmail: 'tolasa.b@iqqo.gov.et',
    collaborators: ['Ato Gemechu Olani (Agronomist)'],
    fiscalYear: 2023,
    startDate: '2023-04-01',
    endDate: '2024-12-31',
    budgetAllocatedETB: 850000,
    budgetUtilizedETB: 320000,
    objectives: [
      'Screen exotic indeterminate non-shattering sesame germplasm for capsule indehiscence at physiological maturity.',
      'Measure grain oil percentage (>52%) and resistance to bacterial blight (Xanthomonas campestris pv. sesami).'
    ],
    methodology: 'Multi-location nursery screening across Haro-Sabu and Begi experimental stations.',
    expectedOutputs: 'Identification of parental lines for mechanizable sesame harvesting.',
    targetAgroEcology: 'Lowland Hot Sub-humid (1450m a.s.l)',
    milestones: [
      { id: 'm-1201', title: 'Germplasm introduction and seed multiplication in quarantine nursery', dueDate: '2023-08-30', completed: true, completedDate: '2023-08-25' },
      { id: 'm-1202', title: 'Field trial under natural bacterial blight pressure', dueDate: '2024-03-31', completed: false }
    ],
    deliverables: [],
    extensionHistory: [],
    lastUpdated: '2024-08-15'
  },
  {
    id: 'act-013',
    code: 'IQQO-NRD-BAT-2025-03',
    title: 'Remediation of Saline-Sodic Soils Using Gypsum and Halophyte Biosaline Agroforestry in Rift Valley Farms',
    centerId: 'batu-soil',
    directorateId: 'natural-resources',
    teamId: 'team-soil-fertility-health',
    status: 'Ongoing',
    progressPercent: 65,
    principalInvestigator: 'Dr. Girma Abera',
    piEmail: 'girma.a@iqqo.gov.et',
    collaborators: ['Ato Sisay Debebe (Soil Chemist)', 'Mrs. Genet Tulu (GIS Analyst)'],
    fiscalYear: 2025,
    startDate: '2024-08-01',
    endDate: '2026-12-31',
    budgetAllocatedETB: 1400000,
    budgetUtilizedETB: 910000,
    objectives: [
      'Determine optimal gypsum requirement based on Exchangeable Sodium Percentage (ESP >15%) to restore soil hydraulic conductivity.',
      'Evaluate salt-tolerant forage grass (Chloris gayana) and halophytic shrubs (Atriplex nummularia) for bio-drainage.',
      'Restore abandoned saline agricultural plots in Batu, Zeway, and Adamitulu irrigation schemes.'
    ],
    methodology: 'Leaching fraction columns in lysimeters and randomized farmer field trial plots with electrical conductivity (ECe) sensors.',
    expectedOutputs: 'Reclamation protocol for 2,500 hectares of degraded irrigated land in Central Rift Valley.',
    targetAgroEcology: 'Lowland Semi-Arid (1600m a.s.l)',
    milestones: [
      { id: 'm-1301', title: 'Soil salinity mapping and groundwater depth table monitoring', dueDate: '2024-12-31', completed: true, completedDate: '2024-12-20', deliverableSummary: 'High ESP detected in 35% of irrigated farms.' },
      { id: 'm-1302', title: 'Gypsum application and flood leaching cycle verification', dueDate: '2025-08-30', completed: true, completedDate: '2025-08-22', deliverableSummary: 'Soil EC reduced from 8.4 dS/m to 3.2 dS/m.' },
      { id: 'm-1303', title: 'Test crop establishment with Rhodes grass and barley', dueDate: '2026-06-30', completed: false }
    ],
    deliverables: [
      { id: 'd-1301', title: 'Rift Valley Saline Soil Reclamation Manual', type: 'Technical Manual', status: 'Draft', date: '2025-11-20' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-03-05'
  },
  {
    id: 'act-014',
    code: 'IQQO-LRD-BOR-2024-01',
    title: 'Selection and Genetic Characterization of Indigenous Highland Dairy Cattle for High Milk Yield and Cold Tolerance',
    centerId: 'bore-arc',
    directorateId: 'livestock-research',
    teamId: 'team-dairy-beef',
    status: 'Ongoing',
    progressPercent: 80,
    principalInvestigator: 'Mr. Seyoum Alemu',
    piEmail: 'seyoum.a@iqqo.gov.et',
    collaborators: ['Dr. Tadele Mirkena (Animal Geneticist)', 'Ato Kedir Dube (Breeder)'],
    fiscalYear: 2024,
    startDate: '2023-06-01',
    endDate: '2026-08-31',
    budgetAllocatedETB: 1900000,
    budgetUtilizedETB: 1540000,
    objectives: [
      'Establish elite open nucleus herd of 120 Guji highland indigenous dairy cows.',
      'Record 305-day lactation yields, butterfat content, and disease tolerance under cold highland temperatures (sub-zero frost events).',
      'Disseminate performance-tested young bulls to pastoralist and agro-pastoralist communities.'
    ],
    methodology: 'On-station open nucleus breeding system with artificial insemination using progeny-tested semen and automated milk meters.',
    expectedOutputs: 'Established superior nucleus herd with average lactation yield exceeding 1,800 kg per cow (up from 650 kg base line).',
    targetAgroEcology: 'Highland Cold Sub-Humid (2750m a.s.l)',
    milestones: [
      { id: 'm-1401', title: 'Baseline morphological and pedigree profiling of foundation Guji herd', dueDate: '2023-11-30', completed: true, completedDate: '2023-11-15', deliverableSummary: '120 cows and 15 sire lines selected.' },
      { id: 'm-1402', title: 'First lactation cycle recording and milk chemical composition assay', dueDate: '2024-12-31', completed: true, completedDate: '2024-12-24', deliverableSummary: 'Butterfat averaged 4.6%.' },
      { id: 'm-1403', title: 'Sire evaluation and selection of top 10 breeding bulls', dueDate: '2025-11-15', completed: true, completedDate: '2025-11-05', deliverableSummary: 'Bulls distributed to community breeding hubs.' },
      { id: 'm-1404', title: 'Comprehensive breeding program review & impact report', dueDate: '2026-07-30', completed: false }
    ],
    deliverables: [
      { id: 'd-1401', title: 'Guji Highland Dairy Cattle Breeding Strategy', type: 'Policy Brief', status: 'Published', date: '2025-05-18' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-03-18'
  },
  {
    id: 'act-015',
    code: 'IQQO-AER-BAK-2025-02',
    title: 'Development of Multi-Functional Solar Bubble Dryer for Maize and Soybean Post-Harvest Loss Mitigation',
    centerId: 'bako-eng',
    directorateId: 'agricultural-engineering',
    teamId: 'team-farm-mechanization',
    status: 'Ongoing',
    progressPercent: 75,
    principalInvestigator: 'Eng. Hailu Negasa',
    piEmail: 'hailu.n@iqqo.gov.et',
    collaborators: ['Ato Chala Dida (Engineer)', 'Dr. Yetenayet Tola (Food Technologist)'],
    fiscalYear: 2025,
    startDate: '2024-04-01',
    endDate: '2026-05-31',
    budgetAllocatedETB: 920000,
    budgetUtilizedETB: 710000,
    objectives: [
      'Fabricate a 1-ton capacity solar bubble dryer with UV-stabilized polyethylene sheeting and solar DC ventilation fans.',
      'Reduce grain moisture content from 22% to safe storage 12.5% within 18 sunshine hours.',
      'Prevent aflatoxin B1 contamination caused by field molds during prolonged highland rains.'
    ],
    methodology: 'Thermodynamic airflow modeling, drying kinetics validation, and moisture balance tracking on Bako experimental campus.',
    expectedOutputs: 'Low-cost commercial drying bundle manufactured using local artisan steel and tarp materials.',
    targetAgroEcology: 'Midland Sub-Humid (1650m a.s.l)',
    milestones: [
      { id: 'm-1501', title: 'Ventilation blower sizing and solar PV panel integration', dueDate: '2024-09-30', completed: true, completedDate: '2024-09-18' },
      { id: 'm-1502', title: 'Maize harvest drying trial during rainy October Meher season', dueDate: '2025-01-30', completed: true, completedDate: '2025-01-22', deliverableSummary: 'Safe storage moisture reached in 16 hours with zero mould.' },
      { id: 'm-1503', title: 'Farmer cooperative adoption pilot in West Shewa', dueDate: '2026-04-30', completed: false }
    ],
    deliverables: [
      { id: 'd-1501', title: 'Solar Bubble Dryer Construction and Operation Manual', type: 'Technical Manual', status: 'Published', date: '2025-09-12' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-02-28'
  },
  {
    id: 'act-016',
    code: 'IQQO-CRD-FAD-2025-01',
    title: 'Participatory Selection of Early-Maturing Drought Resilient Sorghum Varieties in Eastern Hararghe Lowlands',
    centerId: 'fadis-arc',
    directorateId: 'crop-research',
    teamId: 'team-cereal-crops',
    status: 'Ongoing',
    progressPercent: 58,
    principalInvestigator: 'Dr. Ahmed Mohammed',
    piEmail: 'ahmed.m@iqqo.gov.et',
    collaborators: ['Ato Mohammed Kedir (Agronomist)', 'Mrs. Fatuma Ali (Extensionist)'],
    fiscalYear: 2025,
    startDate: '2024-06-01',
    endDate: '2026-12-31',
    budgetAllocatedETB: 1150000,
    budgetUtilizedETB: 670000,
    objectives: [
      'Evaluate 16 early-maturing sorghum landraces and improved varieties for terminal drought tolerance.',
      'Involve 120 male and female smallholder farmers in mother-baby participatory variety selection (PVS).',
      'Identify varieties with stay-green genetic traits and palatable stover for livestock feeding during dry season.'
    ],
    methodology: 'Mother-baby trial design across 6 peasant associations in Fadis and Babile districts.',
    expectedOutputs: 'Official registration of high-performing early sorghum variety giving >3.2 t/ha under <400mm annual rainfall.',
    targetAgroEcology: 'Lowland Semi-Arid (1400m - 1600m a.s.l)',
    milestones: [
      { id: 'm-1601', title: 'Mother trials planting and stand establishment count', dueDate: '2024-08-30', completed: true, completedDate: '2024-08-15' },
      { id: 'm-1602', title: 'Participatory farmer evaluation at physiological maturity', dueDate: '2024-12-15', completed: true, completedDate: '2024-12-08', deliverableSummary: 'Candidate line FAD-SOR-14 ranked #1 by 88% of farmers.' },
      { id: 'm-1603', title: 'Second season verification and stover palatability assessment', dueDate: '2025-12-30', completed: true, completedDate: '2025-12-20' },
      { id: 'm-1604', title: 'Release dossier preparation', dueDate: '2026-10-30', completed: false }
    ],
    deliverables: [
      { id: 'd-1601', title: 'Eastern Hararghe Drought Sorghum Management Guide', type: 'Technical Manual', status: 'Draft', date: '2026-01-15' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-03-22'
  },
  {
    id: 'act-017',
    code: 'IQQO-AER-JIM-2024-03',
    title: 'Design and Optimization of Water-Saving Eco-Friendly Wet Coffee Pulper for Jimma Specialty Coffee Wash Stations',
    centerId: 'jima-eng',
    directorateId: 'agricultural-engineering',
    teamId: 'team-farm-mechanization',
    status: 'Extended',
    progressPercent: 88,
    principalInvestigator: 'Eng. Dawit Kebede',
    piEmail: 'dawit.k@iqqo.gov.et',
    collaborators: ['Dr. Chemeda Abedeta (Coffee Specialist)', 'Ato Solomon Bekele (Technician)'],
    fiscalYear: 2024,
    startDate: '2023-09-01',
    endDate: '2026-08-31',
    budgetAllocatedETB: 1380000,
    budgetUtilizedETB: 1210000,
    objectives: [
      'Engineer a closed-loop water recirculation eco-pulper reducing water use from 20 liters/kg cherry to <2.5 liters/kg cherry.',
      'Maintain cherry skin separation efficiency >98.5% with zero bean nibbling/breakage.',
      'Mitigate acidic wastewater discharge into local river systems in Jimma zone.'
    ],
    methodology: 'Pilot testing at Agaro and Gomma washing stations with continuous water flow meters and biochemical oxygen demand (BOD) wastewater tracking.',
    expectedOutputs: 'Commercial model approved for local manufacturing in Jimma, certified cup quality score above 86 points.',
    targetAgroEcology: 'Midland Humid (1750m a.s.l)',
    milestones: [
      { id: 'm-1701', title: 'Hydrodynamic flow simulation and drum screen machining', dueDate: '2024-04-30', completed: true, completedDate: '2024-04-12' },
      { id: 'm-1702', title: 'Harvest peak operational testing on 50 tonnes of red cherry', dueDate: '2024-12-31', completed: true, completedDate: '2024-12-28', deliverableSummary: 'Water consumption decreased by 82%.' },
      { id: 'm-1703', title: 'Sensory cup quality grading by Ethiopian Coffee & Tea Authority', dueDate: '2025-05-30', completed: true, completedDate: '2025-05-15', deliverableSummary: 'Cup score 87.25 (Specialty Grade 1).' },
      { id: 'm-1704', title: 'Final commercialization workshop and patent filing', dueDate: '2026-07-30', completed: false }
    ],
    deliverables: [
      { id: 'd-1701', title: 'Eco-Pulper Blueprint & Local Manufacturing Guidelines', type: 'Patent / Prototype', status: 'Submitted', date: '2025-08-10' },
      { id: 'd-1702', title: 'Environmental Impact Brief: Wastewater Reduction in Oromia Coffee Wet Mills', type: 'Policy Brief', status: 'Published', date: '2025-11-25' }
    ],
    extensionHistory: [
      {
        id: 'ext-002',
        requestedMonths: 5,
        previousEndDate: '2026-03-31',
        newEndDate: '2026-08-31',
        justification: 'Coffee harvesting peak season was delayed by unseasonal rainfall; additional harvest runs needed for statistical validation of bean damage rates across 3 varieties.',
        requestedBy: 'Eng. Dawit Kebede',
        requestDate: '2026-02-05',
        status: 'Approved',
        reviewedBy: 'Institutional RRC',
        reviewDate: '2026-02-12',
        reviewNotes: 'Approved with requirement to publish final water consumption whitepaper.'
      }
    ],
    lastUpdated: '2026-03-25'
  },
  {
    id: 'act-018',
    code: 'IQQO-SEE-MEC-2025-01',
    title: 'Socioeconomic Assessment of Rangeland Exclosures and Agro-Pastoral Water Harvesting Structures in West Hararghe',
    centerId: 'mechara-arc',
    directorateId: 'socioeconomics-extension',
    teamId: 'team-agricultural-economics',
    status: 'Ongoing',
    progressPercent: 40,
    principalInvestigator: 'Dr. Gemechu Bultosa',
    piEmail: 'gemechu.b@iqqo.gov.et',
    collaborators: ['Dr. Bedada Begna (Economist)', 'Ato Abdi Hassen (Sociologist)'],
    fiscalYear: 2025,
    startDate: '2025-02-01',
    endDate: '2027-02-28',
    budgetAllocatedETB: 980000,
    budgetUtilizedETB: 390000,
    objectives: [
      'Quantify household economic returns from community-managed grazing exclosures across Mechara and Daro Lebu.',
      'Evaluate adoption determinants and gender-differentiated labor burdens of contour bund water catchment structures.',
      'Produce policy recommendations for regional Oromia pastoral development bureau.'
    ],
    methodology: 'Structured econometric survey of 420 households, focus group discussions, and satellite NDVI vegetation biomass time-series tracking.',
    expectedOutputs: 'Peer-reviewed socioeconomic monograph and policy brief for the Oromia Regional Government.',
    targetAgroEcology: 'Midland / Lowland Transition (1500m - 1800m a.s.l)',
    milestones: [
      { id: 'm-1801', title: 'Survey instrument design, pre-testing, and enumerator training', dueDate: '2025-05-30', completed: true, completedDate: '2025-05-18' },
      { id: 'm-1802', title: 'First round household data collection in 14 villages', dueDate: '2025-11-30', completed: true, completedDate: '2025-11-22', deliverableSummary: '420 complete survey records archived.' },
      { id: 'm-1803', title: 'Econometric propensity score matching analysis', dueDate: '2026-08-30', completed: false }
    ],
    deliverables: [
      { id: 'd-1801', title: 'West Hararghe Pastoral Exclosure Assessment Report', type: 'Policy Brief', status: 'Draft', date: '2026-02-10' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-03-27'
  },
  {
    id: 'act-019',
    code: 'IQQO-TMR-HQ-2025-01',
    title: 'Pre-Basic and Basic Seed Multiplication of Climate-Smart Crop Varieties Across Western and Central Oromia',
    centerId: 'iqqo-hq',
    directorateId: 'technology-multiplication',
    teamId: 'team-seed-multiplication',
    status: 'Ongoing',
    progressPercent: 70,
    principalInvestigator: 'Mr. Fikadu Hunde',
    piEmail: 'fikadu.h@iqqo.gov.et',
    collaborators: ['Mr. Tolera Senbeta (Seed Specialist)', 'Ato Dejene Kebede (Agronomist)'],
    fiscalYear: 2025,
    startDate: '2024-05-01',
    endDate: '2026-10-31',
    budgetAllocatedETB: 3200000,
    budgetUtilizedETB: 2310000,
    objectives: [
      'Multiply 1,400 quintals of pre-basic seed of released bread wheat (Daka, Boru) and teff (Dagim, Boset) across 5 centers.',
      'Ensure 99.8% genetic purity and certified germination rate >95% under strict field isolation distances.',
      'Supply certified foundation seed to Oromia Seed Enterprise and farmer seed producer cooperatives.'
    ],
    methodology: 'Strict roguing and quality inspections conducted jointly with the Regional Seed Regulatory Authority.',
    expectedOutputs: 'Sufficient basic seed stocks to plant >70,000 hectares of commercial food crop production in Oromia.',
    targetAgroEcology: 'Headquarters / Multi-Location',
    milestones: [
      { id: 'm-1901', title: 'Land allocation and soil testing across Sinana, Bako, and Fitche stations', dueDate: '2024-07-30', completed: true, completedDate: '2024-07-15' },
      { id: 'm-1902', title: 'Meher season harvest and preliminary seed conditioning', dueDate: '2025-02-28', completed: true, completedDate: '2025-02-20', deliverableSummary: '1,520 quintals raw seed harvested.' },
      { id: 'm-1903', title: 'Laboratory germination and purity certification testing', dueDate: '2025-07-30', completed: true, completedDate: '2025-07-18', deliverableSummary: '98.4% germination rate achieved.' },
      { id: 'm-1904', title: 'Second season seed allocation and handover to cooperatives', dueDate: '2026-09-30', completed: false }
    ],
    deliverables: [
      { id: 'd-1901', title: 'Institutional Basic Seed Production Annual Catalogue 2025/2026', type: 'Technical Manual', status: 'Published', date: '2025-10-01' }
    ],
    extensionHistory: [],
    lastUpdated: '2026-03-29'
  },
  {
    id: 'act-020',
    code: 'IQQO-CRD-ADA-2026-02',
    title: 'Evaluation of Drought-Tolerant Pigeon Pea and Cowpea Intercropping in Rift Valley Maize Systems',
    centerId: 'adami-tulu',
    directorateId: 'crop-research',
    teamId: 'team-pulses-oilseeds',
    status: 'New',
    progressPercent: 5,
    principalInvestigator: 'Dr. Teshale Wolde',
    piEmail: 'teshale.w@iqqo.gov.et',
    collaborators: ['Ato Gemechu Tufa (Legume Breeder)'],
    fiscalYear: 2026,
    startDate: '2026-03-15',
    endDate: '2028-11-30',
    budgetAllocatedETB: 950000,
    budgetUtilizedETB: 45000,
    objectives: [
      'Screen 8 dual-purpose pigeon pea accessions for biological nitrogen fixation in semi-arid Rift Valley soils.',
      'Assess land equivalent ratio (LER) and livestock fodder biomass of maize-legume strip cropping.',
      'Measure long-term soil organic matter enhancement over 3 cropping seasons.'
    ],
    methodology: 'Randomized strip-split plot design with 4 replications at Adami Tulu on sandy loam soils.',
    expectedOutputs: 'Intercropping technology manual for moisture-stressed mid-rift valley districts.',
    targetAgroEcology: 'Lowland Semi-Arid (1650m a.s.l)',
    milestones: [
      { id: 'm-2001', title: 'Procurement of foundation legume seed and rhizobial inoculant stocks', dueDate: '2026-05-31', completed: true, completedDate: '2026-03-30' },
      { id: 'm-2002', title: 'Belg season trial sowing and nodulation assessment', dueDate: '2026-08-31', completed: false },
      { id: 'm-2003', title: 'Post-harvest fodder biomass analysis and farmer evaluation', dueDate: '2026-12-15', completed: false }
    ],
    deliverables: [],
    extensionHistory: [],
    lastUpdated: '2026-04-01'
  }
];

export const INITIAL_ACTIVITIES: ResearchActivity[] = [
  ...BASE_ACTIVITIES,
  ...NATURAL_RESOURCES_ACTIVITIES,
  ...LIVESTOCK_ACTIVITIES,
  ...COMPLETED_ACTIVITIES
];
