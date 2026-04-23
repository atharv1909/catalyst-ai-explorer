import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { candidates as seedCandidates, initialLoggedResults, Candidate } from "@/lib/mockData";

export interface LoggedResult {
  candidate: string;
  yield: number;
  selectivity: number;
  temp: number;
  pressure: number;
  loading: number;
  instrument: string;
  notes: string;
  date: string;
}

export interface QueryParams {
  reaction: string;
  temp: string;
  pressure: string;
  family: string;
}

interface Ctx {
  candidates: Candidate[];
  selected: Candidate | null;
  setSelected: (c: Candidate | null) => void;
  shortlist: string[];
  toggleShortlist: (name: string) => void;
  loggedResults: LoggedResult[];
  addLoggedResult: (r: LoggedResult) => void;
  retrainCounter: number;
  modelVersion: string;
  query: QueryParams;
  setQuery: (q: QueryParams) => void;
}

const CatalystContext = createContext<Ctx | null>(null);

export function CatalystProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Candidate | null>(seedCandidates[0]);
  const [shortlist, setShortlist] = useState<string[]>(["ZSM-5-Zn-0.5wt%", "HZSM-5-Ga-MolGPT-v1"]);
  const [loggedResults, setLoggedResults] = useState<LoggedResult[]>(initialLoggedResults);
  const [retrainCounter, setRetrainCounter] = useState(3);
  const [modelVersion, setModelVersion] = useState("v3.2");

  const toggleShortlist = (name: string) =>
    setShortlist((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));

  const addLoggedResult = (r: LoggedResult) => {
    setLoggedResults((prev) => [r, ...prev]);
    setRetrainCounter((c) => {
      const next = c + 1;
      if (next >= 5) {
        setModelVersion((v) => {
          const n = parseFloat(v.replace("v", "")) + 0.1;
          return `v${n.toFixed(1)}`;
        });
        return 0;
      }
      return next;
    });
  };

  const value = useMemo<Ctx>(
    () => ({
      candidates: seedCandidates,
      selected,
      setSelected,
      shortlist,
      toggleShortlist,
      loggedResults,
      addLoggedResult,
      retrainCounter,
      modelVersion,
    }),
    [selected, shortlist, loggedResults, retrainCounter, modelVersion],
  );

  return <CatalystContext.Provider value={value}>{children}</CatalystContext.Provider>;
}

export function useCatalyst() {
  const ctx = useContext(CatalystContext);
  if (!ctx) throw new Error("useCatalyst must be used inside CatalystProvider");
  return ctx;
}
