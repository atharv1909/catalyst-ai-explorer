// Embedded XYZ molecule structures for the 3D viewer demo.
// 3Dmol cannot parse SMILES client-side without an external service, so we
// ship a small library of pre-computed 3D coordinates and pick the closest
// match by candidate name / SMILES.

export const XYZ_LIBRARY: Record<string, { label: string; xyz: string }> = {
  ethanol: {
    label: "Ethanol (C2H6O)",
    xyz: `9
Ethanol
C    1.168    -0.400     0.000
C    0.000     0.553     0.000
O   -1.190    -0.213     0.000
H    2.105     0.158     0.000
H    1.143    -1.044     0.881
H    1.143    -1.044    -0.881
H    0.027     1.200     0.881
H    0.027     1.200    -0.881
H   -1.943     0.385     0.000
`,
  },
  benzene: {
    label: "Benzene (C6H6)",
    xyz: `12
Benzene
C    1.396     0.000     0.000
C    0.698     1.209     0.000
C   -0.698     1.209     0.000
C   -1.396     0.000     0.000
C   -0.698    -1.209     0.000
C    0.698    -1.209     0.000
H    2.479     0.000     0.000
H    1.240     2.147     0.000
H   -1.240     2.147     0.000
H   -2.479     0.000     0.000
H   -1.240    -2.147     0.000
H    1.240    -2.147     0.000
`,
  },
  naphthalene: {
    label: "Naphthalene (C10H8)",
    xyz: `18
Naphthalene
C    1.243     0.706     0.000
C    1.243    -0.706     0.000
C    0.000    -1.401     0.000
C   -1.243    -0.706     0.000
C   -1.243     0.706     0.000
C    0.000     1.401     0.000
C    2.486     1.401     0.000
C    3.729     0.706     0.000
C    3.729    -0.706     0.000
C    2.486    -1.401     0.000
H    0.000    -2.490     0.000
H   -2.187    -1.247     0.000
H   -2.187     1.247     0.000
H    0.000     2.490     0.000
H    2.486     2.490     0.000
H    4.673     1.247     0.000
H    4.673    -1.247     0.000
H    2.486    -2.490     0.000
`,
  },
  phenol: {
    label: "Phenol (C6H6O)",
    xyz: `13
Phenol
C    1.396     0.000     0.000
C    0.698     1.209     0.000
C   -0.698     1.209     0.000
C   -1.396     0.000     0.000
C   -0.698    -1.209     0.000
C    0.698    -1.209     0.000
O    2.760     0.000     0.000
H    3.107     0.910     0.000
H    1.240     2.147     0.000
H   -1.240     2.147     0.000
H   -2.479     0.000     0.000
H   -1.240    -2.147     0.000
H    1.240    -2.147     0.000
`,
  },
  acetic: {
    label: "Acetic acid (C2H4O2)",
    xyz: `8
Acetic acid
C    0.000     0.000     0.000
C    1.520     0.000     0.000
O   -0.620     1.060     0.000
O   -0.620    -1.060     0.000
H   -1.580    -1.020     0.000
H    1.910    -0.510     0.890
H    1.910    -0.510    -0.890
H    1.910     1.020     0.000
`,
  },
  propanol: {
    label: "1-Propanol (C3H8O)",
    xyz: `12
Propanol
C   -1.890    -0.250     0.000
C   -0.510     0.380     0.000
C    0.610    -0.640     0.000
O    1.870    -0.040     0.000
H    1.940     0.560     0.760
H   -2.640     0.530     0.000
H   -2.020    -0.870     0.890
H   -2.020    -0.870    -0.890
H   -0.420     1.020     0.880
H   -0.420     1.020    -0.880
H    0.530    -1.280     0.880
H    0.530    -1.280    -0.880
`,
  },
  pentane: {
    label: "n-Pentane (C5H12)",
    xyz: `17
Pentane
C   -2.540     0.000     0.000
C   -1.270     0.770     0.000
C    0.000     0.000     0.000
C    1.270     0.770     0.000
C    2.540     0.000     0.000
H   -3.420     0.640     0.000
H   -2.580    -0.640     0.880
H   -2.580    -0.640    -0.880
H   -1.260     1.420     0.880
H   -1.260     1.420    -0.880
H    0.000    -0.650     0.880
H    0.000    -0.650    -0.880
H    1.260     1.420     0.880
H    1.260     1.420    -0.880
H    3.420     0.640     0.000
H    2.580    -0.640     0.880
H    2.580    -0.640    -0.880
`,
  },
};

// Pick a structure based on candidate name/smiles heuristics.
export function pickMoleculeFor(name: string, smiles: string): { label: string; xyz: string; key: string } {
  const n = name.toLowerCase();
  const s = smiles.toLowerCase();

  if (s.includes("c1ccc2") || n.includes("naphthal")) return { ...XYZ_LIBRARY.naphthalene, key: "naphthalene" };
  if (s === "c1ccccc1o" || s.includes("ccc(o)cc")) return { ...XYZ_LIBRARY.phenol, key: "phenol" };
  if (s.includes("c1cccc")) return { ...XYZ_LIBRARY.benzene, key: "benzene" };
  if (s.includes("c(=o)o") || n.includes("acetic")) return { ...XYZ_LIBRARY.acetic, key: "acetic" };
  if (s === "ccccc" || s.includes("cccc")) return { ...XYZ_LIBRARY.pentane, key: "pentane" };
  if (s === "ccco" || s === "ccccо" || s.includes("ccc(o)") || s.includes("cc(c)o")) return { ...XYZ_LIBRARY.propanol, key: "propanol" };
  return { ...XYZ_LIBRARY.ethanol, key: "ethanol" };
}
