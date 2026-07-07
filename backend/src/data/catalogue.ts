export type Variant = { dose: string; price: number }
export type CatalogueItem = {
  handle: string
  name: string
  category?: string
  desc: string
  badge?: string | null
  color: string
  image?: string | null
  optionLabel?: string
  noCoa?: boolean
  variants: Variant[]
}

export const CATEGORIES = [
  "Tissue Repair & Regenerative Support",
  "Hormonal Balance & Metabolic Regulation",
  "Resilience & Healthy Aging",
  "Neuro-Enhancement & Specialty Protocols",
  "Lab Supplies",
] as const

export const PRODUCTS: CatalogueItem[] = [
  { handle: "bpc-157", name: "BPC-157", category: "Tissue Repair & Regenerative Support", desc: "A synthetic peptide fragment that is the subject of ongoing preclinical research into tissue-repair and gastrointestinal models.", badge: "Popular", color: "#a84e1c", variants: [{ dose: "5mg", price: 59.95 }, { dose: "10mg", price: 94.99 }] },
  { handle: "tb-500", name: "TB-500", category: "Tissue Repair & Regenerative Support", desc: "A synthetic version of thymosin beta-4, studied in research into cellular-repair and recovery models.", badge: null, color: "#b8632a", variants: [{ dose: "10mg", price: 129.99 }] },
  { handle: "bpc-tb", name: "BPC-157 + TB-500", category: "Tissue Repair & Regenerative Support", desc: "A combination of BPC-157 and TB-500 supplied together in a single vial for tissue-repair research applications.", badge: "Stack", color: "#8a5a33", variants: [{ dose: "10mg", price: 109.99 }] },
  { handle: "kpv", name: "KPV", category: "Tissue Repair & Regenerative Support", desc: "A tripeptide fragment (lysine-proline-valine) studied in research into inflammatory-response models.", badge: null, color: "#c2601f", variants: [{ dose: "10mg", price: 89.99 }] },
  { handle: "ghk-cu", name: "Copper Peptide (GHK-Cu)", category: "Tissue Repair & Regenerative Support", desc: "A naturally occurring copper-binding peptide investigated in research into skin, collagen and wound-healing models.", badge: null, color: "#b87333", variants: [{ dose: "50mg", price: 69.95 }, { dose: "100mg", price: 109.95 }] },
  { handle: "glow", name: "GLOW Peptide Blend", category: "Tissue Repair & Regenerative Support", desc: "A multi-peptide research blend combining BPC-157, TB-500 and GHK-Cu in a single vial for tissue-repair research.", badge: "Blend", color: "#d98841", variants: [{ dose: "50mg", price: 168.99 }, { dose: "70mg", price: 199.99 }] },
  { handle: "klow", name: "Klow (Multi-Peptide Stack)", category: "Tissue Repair & Regenerative Support", desc: "An advanced, proprietary multi-peptide stack combining four synthetic peptides — BPC-157, GHK-Cu, TB-500 and KPV — in a single formulation for research applications.", badge: "Premium Stack", color: "#c2601f", variants: [{ dose: "Blend 78mg", price: 189.95 }, { dose: "Blend 130mg", price: 289.95 }] },
  { handle: "retatrutide", name: "Retatrutide", category: "Hormonal Balance & Metabolic Regulation", desc: "A multi-receptor agonist peptide investigated in metabolic research, including laboratory studies of energy balance and body-weight regulation.", badge: "Best Seller", color: "#14b8a0", image: "images/retatrutide.avif", variants: [{ dose: "10mg", price: 144.99 }, { dose: "15mg", price: 179.99 }, { dose: "20mg", price: 229.99 }, { dose: "30mg", price: 329.99 }, { dose: "40mg", price: 429.95 }, { dose: "60mg", price: 549.99 }] },
  { handle: "tirzepatide", name: "Tirzepatide", category: "Hormonal Balance & Metabolic Regulation", desc: "A dual GIP and GLP-1 receptor agonist peptide investigated in metabolic research, including laboratory studies of glucose regulation and energy balance.", badge: "Popular", color: "#8a5a33", variants: [{ dose: "10mg", price: 139.95 }, { dose: "20mg", price: 249.99 }, { dose: "30mg", price: 319.95 }, { dose: "40mg", price: 343.99 }, { dose: "60mg", price: 423.99 }] },
  { handle: "cjc-ipamorelin", name: "CJC-1295 + Ipamorelin", category: "Hormonal Balance & Metabolic Regulation", desc: "A peptide combination studied in research contexts for its effects on growth-hormone secretion pathways.", badge: "Stack", color: "#9c6b3f", variants: [{ dose: "5mg + 5mg", price: 119.95 }, { dose: "10mg + 10mg", price: 199.95 }] },
  { handle: "cjc-no-dac", name: "CJC-1295 (no DAC)", category: "Hormonal Balance & Metabolic Regulation", desc: "A growth-hormone-releasing peptide analogue studied in research into GH-secretion pathways.", badge: null, color: "#6b4226", variants: [{ dose: "10mg", price: 104.99 }] },
  { handle: "cjc-dac", name: "CJC-1295 with DAC", category: "Hormonal Balance & Metabolic Regulation", desc: "A long-acting growth-hormone-releasing peptide analogue studied in GH-axis research.", badge: null, color: "#7a5333", variants: [{ dose: "10mg", price: 179.99 }] },
  { handle: "ipamorelin", name: "Ipamorelin", category: "Hormonal Balance & Metabolic Regulation", desc: "A selective growth-hormone secretagogue studied in research into GH-release pathways.", badge: null, color: "#a06a3a", variants: [{ dose: "10mg", price: 89.99 }] },
  { handle: "tesamorelin", name: "Tesamorelin", category: "Hormonal Balance & Metabolic Regulation", desc: "A stabilised GHRH analogue investigated in metabolic and body-composition research.", badge: null, color: "#8a5a33", variants: [{ dose: "5mg", price: 79.99 }, { dose: "10mg", price: 145.99 }, { dose: "20mg", price: 259.99 }] },
  { handle: "aod-9604", name: "AOD-9604", category: "Hormonal Balance & Metabolic Regulation", desc: "A modified fragment of the growth-hormone molecule studied in metabolic research models.", badge: null, color: "#c2601f", variants: [{ dose: "5mg", price: 99.99 }] },
  { handle: "cagrilintide", name: "Cagrilintide", category: "Hormonal Balance & Metabolic Regulation", desc: "A long-acting amylin analogue investigated in metabolic and appetite-regulation research.", badge: null, color: "#b87333", variants: [{ dose: "5mg", price: 129.99 }] },
  { handle: "amino-1mq", name: "5-Amino-1MQ", category: "Hormonal Balance & Metabolic Regulation", desc: "A small-molecule research compound studied in metabolic and NNMT-pathway research.", badge: null, color: "#9c6b3f", variants: [{ dose: "50mg", price: 109.99 }] },
  { handle: "slu-pp-332", name: "SLU-PP-332", category: "Hormonal Balance & Metabolic Regulation", desc: "A research compound studied in metabolic and mitochondrial-activity models.", badge: null, color: "#a84e1c", variants: [{ dose: "5mg", price: 105.99 }] },
  { handle: "mots-c", name: "MOTS-c", category: "Resilience & Healthy Aging", desc: "A mitochondrial-derived peptide studied in research into cellular energy metabolism and insulin-sensitivity pathways, of interest in metabolic and ageing research.", badge: "New", color: "#5a7d5a", variants: [{ dose: "5mg", price: 89.95 }, { dose: "10mg", price: 94.99 }, { dose: "20mg", price: 125.99 }, { dose: "40mg", price: 159.99 }] },
  { handle: "nad", name: "NAD+", category: "Resilience & Healthy Aging", desc: "A cellular coenzyme supplied for research into energy-metabolism and cellular-ageing models.", badge: null, color: "#6b8a5a", variants: [{ dose: "500mg", price: 129.99 }] },
  { handle: "ss-31", name: "SS-31", category: "Resilience & Healthy Aging", desc: "A mitochondria-targeted research peptide studied in cellular-energy and oxidative-stress models.", badge: null, color: "#4f7a6a", variants: [{ dose: "10mg", price: 89.99 }] },
  { handle: "epitalon", name: "Epitalon", category: "Resilience & Healthy Aging", desc: "A synthetic tetrapeptide studied in research into telomere and cellular-ageing pathways.", badge: null, color: "#5a7d5a", variants: [{ dose: "10mg", price: 79.99 }] },
  { handle: "glutathione", name: "Glutathione", category: "Resilience & Healthy Aging", desc: "An antioxidant tripeptide supplied for research into oxidative-stress and cellular models.", badge: null, color: "#7a9060", variants: [{ dose: "600mg", price: 79.99 }] },
  { handle: "ara-290", name: "ARA-290 (Cibinetide)", category: "Resilience & Healthy Aging", desc: "A synthetic peptide studied in research into tissue-protection and neuropathy models.", badge: null, color: "#6b8a5a", variants: [{ dose: "10mg", price: 89.99 }] },
  { handle: "selank", name: "Selank", category: "Neuro-Enhancement & Specialty Protocols", desc: "A synthetic analogue of the peptide tuftsin, studied in neuroscience research into stress-response and cognition pathways.", badge: null, color: "#5a7d5a", variants: [{ dose: "5mg", price: 64.95 }, { dose: "10mg", price: 94.99 }] },
  { handle: "semax", name: "Semax", category: "Neuro-Enhancement & Specialty Protocols", desc: "A synthetic peptide studied in neuroscience research into cognitive-function and neuroprotection pathways.", badge: null, color: "#7a5f2a", variants: [{ dose: "5mg", price: 69.95 }, { dose: "10mg", price: 69.99 }, { dose: "30mg", price: 269.95 }] },
  { handle: "dsip", name: "DSIP", category: "Neuro-Enhancement & Specialty Protocols", desc: "A delta sleep-inducing peptide studied in research into sleep-regulation and stress models.", badge: null, color: "#6b5a44", variants: [{ dose: "10mg", price: 75.99 }] },
  { handle: "pt-141", name: "PT-141", category: "Neuro-Enhancement & Specialty Protocols", desc: "A melanocortin-receptor peptide studied in neuroscience and receptor-pathway research.", badge: null, color: "#a84e1c", variants: [{ dose: "10mg", price: 99.99 }] },
  { handle: "melanotan-1", name: "Melanotan I", category: "Neuro-Enhancement & Specialty Protocols", desc: "A synthetic analogue of alpha-MSH studied in research into melanogenesis (pigmentation) pathways.", badge: null, color: "#b87333", variants: [{ dose: "10mg", price: 79.99 }] },
  { handle: "melanotan-2", name: "Melanotan II", category: "Neuro-Enhancement & Specialty Protocols", desc: "A synthetic melanocortin analogue studied in research into pigmentation and receptor pathways.", badge: null, color: "#c2601f", variants: [{ dose: "10mg", price: 79.99 }] },
  { handle: "bac-water", name: "Bacteriostatic Water", category: "Lab Supplies", desc: "Bacteriostatic water for laboratory reconstitution of lyophilised research peptides. Contains 0.9% benzyl alcohol. Not for injection.", badge: null, color: "#7a8a9a", optionLabel: "Size", noCoa: true, variants: [{ dose: "3mL", price: 19.99 }, { dose: "10mL", price: 28.99 }] },
  { handle: "syringes", name: "Insulin Syringes", category: "Lab Supplies", desc: "Sterile single-use syringes for laboratory handling and measurement of reconstituted research material.", badge: null, color: "#8a9aa5", optionLabel: "Pack", noCoa: true, variants: [{ dose: "20 pack", price: 22.99 }] },
]

export const KITS: CatalogueItem[] = [
  { handle: "kit-recovery", name: "Recovery & Repair Kit", desc: "A bundled research kit pairing BPC-157, TB-500 and GHK-Cu, supplied together at bulk pricing for tissue-repair research programs.", badge: "Best Value", color: "#a84e1c", optionLabel: "Kit Size", variants: [{ dose: "Standard — 3 vials", price: 249.95 }, { dose: "Bulk — 6 vials", price: 459.95 }, { dose: "Lab — 12 vials", price: 839.95 }] },
  { handle: "kit-metabolic", name: "Metabolic Research Kit", desc: "A bundled kit combining Retatrutide and Tirzepatide for laboratories running metabolic research at volume.", badge: "Popular", color: "#8a5a33", optionLabel: "Kit Size", variants: [{ dose: "Standard — 2 vials", price: 269.95 }, { dose: "Bulk — 6 vials", price: 749.95 }] },
  { handle: "kit-cognition", name: "Cognition Research Kit", desc: "A bundled kit pairing Selank and Semax for neuroscience research applications, priced for volume.", badge: null, color: "#5a7d5a", optionLabel: "Kit Size", variants: [{ dose: "Standard — 2 vials", price: 129.95 }, { dose: "Bulk — 6 vials", price: 349.95 }] },
  { handle: "kit-supplies", name: "Reconstitution Supplies Kit", desc: "Laboratory reconstitution supplies — bacteriostatic water, sterile syringes and alcohol swabs — bundled for research handling. Contains no peptides.", badge: "Supplies", color: "#6b4226", optionLabel: "Pack Size", noCoa: true, variants: [{ dose: "Starter — 10 sets", price: 39.95 }, { dose: "Bulk — 25 sets", price: 84.95 }] },
]
