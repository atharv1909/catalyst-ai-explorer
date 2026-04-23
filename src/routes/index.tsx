import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Atom, Play, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalyst } from "@/context/CatalystContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Query — CatalystIQ" },
      { name: "description", content: "Run AI-accelerated catalyst discovery pipeline for ETJ fuel synthesis." },
    ],
  }),
  component: QueryPage,
});

const STEPS = [
  "Querying Materials Project API…",
  "Running MolGPT generation…",
  "Predicting with Chemprop (MC-Dropout n=50)…",
  "Ranking candidates by composite score…",
];

function QueryPage() {
  const navigate = useNavigate();
  const { query, setQuery } = useCatalyst();
  const [reaction, setReaction] = useState(query.reaction);
  const [temp, setTemp] = useState(query.temp);
  const [pressure, setPressure] = useState(query.pressure);
  const [family, setFamily] = useState(query.family);

  const REACTIONS = [
    "Ethanol → Jet-range hydrocarbons (C8–C16)",
    "Ethanol → Ethylene (dehydration)",
    "Ethanol → Butadiene (Lebedev process)",
    "Ethanol → Acetaldehyde (oxidative)",
    "Ethanol → 1-Butanol (Guerbet coupling)",
    "Methanol → Olefins (MTO)",
    "Methanol → Gasoline (MTG)",
    "CO₂ + H₂ → Methanol (hydrogenation)",
    "CO₂ + H₂ → Jet fuel (Fischer–Tropsch)",
    "Syngas → Higher alcohols",
    "Glycerol → Propylene glycol",
    "Furfural → 2-Methylfuran",
  ];
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  const onRun = () => {
    const nextQuery = { reaction, temp, pressure, family };
    setQuery(nextQuery);
    setRunning(true);
    setStep(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < STEPS.length) {
        setStep(i);
        setTimeout(tick, 750);
      } else {
        setStep(STEPS.length);
        setTimeout(
          () =>
            navigate({
              to: "/results",
              search: nextQuery,
            }),
          500,
        );
      }
    };
    setTimeout(tick, 750);
  };

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center mb-5">
          <div className="relative h-16 w-16 rounded-xl bg-cyan/10 border border-cyan/40 flex items-center justify-center">
            <Atom className="h-9 w-9 text-cyan" />
            <span className="absolute inset-0 rounded-xl bg-cyan/20 blur-xl opacity-70" />
          </div>
        </div>
        <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight">
          Catalyst<span className="text-cyan glow-text">IQ</span>
        </h1>
        <p className="mt-3 text-muted-foreground text-sm md:text-base font-mono">
          AI-Accelerated Molecular Discovery
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          GPS Renewables · Ethanol-to-Jet Catalyst Screening · Pipeline v3.2
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!running ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="panel panel-glow rounded-xl p-6 md:p-8"
          >
            <div className="space-y-5">
              <div>
                <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Target Reaction
                </Label>
                <Select value={reaction} onValueChange={setReaction}>
                  <SelectTrigger className="mt-1.5 font-mono bg-input/60 focus:ring-cyan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {REACTIONS.map((r) => (
                      <SelectItem key={r} value={r} className="font-mono text-xs">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Temperature (°C)
                  </Label>
                  <Input
                    type="number"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="mt-1.5 font-mono bg-input/60"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Pressure (bar)
                  </Label>
                  <Input
                    type="number"
                    value={pressure}
                    onChange={(e) => setPressure(e.target.value)}
                    className="mt-1.5 font-mono bg-input/60"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Catalyst Family
                </Label>
                <Select value={family} onValueChange={setFamily}>
                  <SelectTrigger className="mt-1.5 font-mono bg-input/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZSM-5 Zeolites">ZSM-5 Zeolites</SelectItem>
                    <SelectItem value="Metal/Acid Bifunctional">Metal/Acid Bifunctional</SelectItem>
                    <SelectItem value="Metal Oxides">Metal Oxides</SelectItem>
                    <SelectItem value="All Families">All Families</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={onRun}
                className="btn-glow w-full h-12 text-sm font-mono uppercase tracking-wider"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Discovery Pipeline
              </Button>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                {[
                  { l: "Candidates", v: "1,842" },
                  { l: "Avg MAE", v: "0.041" },
                  { l: "Active Model", v: "v3.2" },
                ].map((s) => (
                  <div key={s.l} className="rounded-md border border-border bg-muted/30 p-2.5">
                    <div className="font-mono text-base text-cyan">{s.v}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="panel panel-glow rounded-xl p-8"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="h-5 w-5 text-cyan animate-spin" />
                <h3 className="font-mono text-sm uppercase tracking-wider">
                  Running Discovery Pipeline
                </h3>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan to-[color:var(--purple-tag)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(step / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ boxShadow: "0 0 12px var(--cyan-glow)" }}
                />
              </div>
              <ul className="space-y-2.5">
                {STEPS.map((s, i) => {
                  const done = i < step;
                  const active = i === step;
                  return (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: done || active ? 1 : 0.4 }}
                      className="flex items-center gap-3 font-mono text-sm"
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          done
                            ? "bg-cyan/15 border-cyan text-cyan"
                            : active
                            ? "border-cyan text-cyan"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : active ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <span className="text-[10px]">{i + 1}</span>
                        )}
                      </span>
                      <span className={done || active ? "text-foreground" : "text-muted-foreground"}>
                        {s}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
