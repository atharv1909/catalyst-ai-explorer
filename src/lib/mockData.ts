export type Source = "OCP" | "MolGPT" | "Perturbed";

export interface Candidate {
  rank: number;
  name: string;
  smiles: string;
  activity: number;
  selectivity: number;
  stability: number;
  uncertainty: number;
  source: Source;
  shap: { feature: string; value: number }[];
}

const baseShap = [
  { feature: "Zinc_dopant_presence", value: 0.34 },
  { feature: "Brønsted_acid_sites", value: 0.27 },
  { feature: "Aromatic_fraction", value: 0.18 },
  { feature: "Ring_count", value: -0.14 },
  { feature: "Heteroatom_ratio", value: 0.11 },
  { feature: "Molecular_weight", value: -0.08 },
];

function shapVariant(seed: number) {
  return baseShap.map((s, i) => ({
    feature: s.feature,
    value: +(s.value + Math.sin(seed + i) * 0.08).toFixed(3),
  }));
}

export const candidates: Candidate[] = [
  { rank: 1, name: "ZSM-5-Zn-0.5wt%",       smiles: "CCO",                                      activity: 0.847, selectivity: 0.723, stability: 0.81, uncertainty: 0.06, source: "OCP",       shap: shapVariant(1) },
  { rank: 2, name: "HZSM-5-Ga-MolGPT-v1",   smiles: "c1ccc2c(c1)cccc2",                         activity: 0.791, selectivity: 0.801, stability: 0.74, uncertainty: 0.09, source: "MolGPT",    shap: shapVariant(2) },
  { rank: 3, name: "ZSM-5-Mo-perturbed",    smiles: "CC(=O)O",                                  activity: 0.763, selectivity: 0.689, stability: 0.88, uncertainty: 0.05, source: "Perturbed", shap: shapVariant(3) },
  { rank: 4, name: "Bifunctional-Pt-ZSM5",  smiles: "CCCCO",                                    activity: 0.821, selectivity: 0.644, stability: 0.79, uncertainty: 0.08, source: "OCP",       shap: shapVariant(4) },
  { rank: 5, name: "HZSM-5-Ga-MolGPT-v2",   smiles: "c1ccccc1O",                                activity: 0.734, selectivity: 0.856, stability: 0.71, uncertainty: 0.11, source: "MolGPT",    shap: shapVariant(5) },
  { rank: 6, name: "ZSM-5-baseline",        smiles: "CCO",                                      activity: 0.698, selectivity: 0.712, stability: 0.92, uncertainty: 0.04, source: "OCP",       shap: shapVariant(6) },
  { rank: 7, name: "Al-MCM-41-perturbed",   smiles: "CC(C)O",                                   activity: 0.671, selectivity: 0.778, stability: 0.68, uncertainty: 0.07, source: "Perturbed", shap: shapVariant(7) },
  { rank: 8, name: "Ni-HZSM-5-OCP",         smiles: "CCCO",                                     activity: 0.812, selectivity: 0.601, stability: 0.83, uncertainty: 0.06, source: "OCP",       shap: shapVariant(8) },
  { rank: 9, name: "Cu-ZSM-5-MolGPT-v3",    smiles: "CC(C)CC",                                  activity: 0.709, selectivity: 0.741, stability: 0.77, uncertainty: 0.10, source: "MolGPT",    shap: shapVariant(9) },
  { rank: 10, name: "Sn-Beta-perturbed",    smiles: "CCC(O)C",                                  activity: 0.682, selectivity: 0.755, stability: 0.74, uncertainty: 0.08, source: "Perturbed", shap: shapVariant(10) },
  { rank: 11, name: "Fe-ZSM-5-OCP",         smiles: "CCCCC",                                    activity: 0.731, selectivity: 0.622, stability: 0.86, uncertainty: 0.07, source: "OCP",       shap: shapVariant(11) },
  { rank: 12, name: "Ga-MFI-MolGPT-v4",     smiles: "c1ccc(O)cc1",                              activity: 0.717, selectivity: 0.793, stability: 0.69, uncertainty: 0.12, source: "MolGPT",    shap: shapVariant(12) },
];

export const modelVersions = [
  { version: "v3.2", date: "2025-04-19", mae: 0.041, dataSize: 1842, trigger: "Auto-retrain (5 results)", status: "Active" },
  { version: "v3.1", date: "2025-04-12", mae: 0.048, dataSize: 1825, trigger: "Manual (Dr. Sharma)",       status: "Active" },
  { version: "v3.0", date: "2025-04-01", mae: 0.054, dataSize: 1801, trigger: "Quarterly cadence",         status: "Active" },
  { version: "v2.4", date: "2025-03-15", mae: 0.061, dataSize: 1740, trigger: "Drift detected",            status: "Archived" },
  { version: "v2.3", date: "2025-02-28", mae: 0.069, dataSize: 1688, trigger: "Initial release",           status: "Archived" },
];

export const initialLoggedResults = [
  { candidate: "ZSM-5-Zn-0.5wt%",     yield: 71, selectivity: 68, temp: 350, pressure: 18, loading: 0.5, instrument: "Agilent 7890B GC-FID", notes: "Stable conversion over 12h.",  date: "2025-04-19" },
  { candidate: "HZSM-5-Ga-MolGPT-v1", yield: 64, selectivity: 73, temp: 380, pressure: 22, loading: 0.7, instrument: "Shimadzu GC-2014",     notes: "Slight coking at 8h.",         date: "2025-04-17" },
  { candidate: "Bifunctional-Pt-ZSM5",yield: 69, selectivity: 61, temp: 340, pressure: 15, loading: 0.4, instrument: "Agilent 7890B GC-FID", notes: "Excellent activity, low sel.", date: "2025-04-15" },
];

export const provenanceFor = (name: string) => [
  { icon: "DB",   title: "OCP Database Entry #47821",             desc: "DFT relaxation, projected band gap 2.31 eV",                  ts: "2023-11-04 08:00" },
  { icon: "API",  title: "Retrieved by Materials Project API",    desc: `Query: catalyst_family=ZSM-5, target=${name.split("-")[0]}`,  ts: "2025-04-18 09:12" },
  { icon: "PER",  title: "Fingerprint perturbation generated",    desc: "Morgan radius=2, perturbation σ=0.05",                        ts: "2025-04-18 09:14" },
  { icon: "RDK",  title: "RDKit validity check: PASSED",          desc: "Sanitization, valence, aromaticity verified",                 ts: "2025-04-18 09:14" },
  { icon: "CHM",  title: "Chemprop v3.1 prediction",              desc: `Activity=0.847, Selectivity=0.723, MC-Dropout n=50`,          ts: "2025-04-18 09:15" },
  { icon: "USR",  title: "Shortlisted by Dr. Priya Sharma",       desc: "Flagged for wet-lab validation queue",                        ts: "2025-04-18 10:30" },
  { icon: "EXP",  title: "Experimental result logged",            desc: "Yield=71%, Selectivity=68%, T=350°C, P=18 bar",               ts: "2025-04-19 14:22" },
  { icon: "ML",   title: "Model retrained → v3.2",                desc: "MAE 0.048 → 0.041 on validation set (Δ -14.6%)",              ts: "2025-04-19 15:01" },
];
