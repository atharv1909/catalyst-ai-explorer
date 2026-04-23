import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, FlaskConical } from "lucide-react";
import { useCatalyst } from "@/context/CatalystContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/log")({
  head: () => ({
    meta: [
      { title: "Log Experimental Results — CatalystIQ" },
      { name: "description", content: "Submit wet-lab measurements to retrain the predictive model." },
    ],
  }),
  component: LogPage,
});

function LogPage() {
  const { shortlist, candidates, addLoggedResult, loggedResults, retrainCounter, modelVersion } =
    useCatalyst();
  const allNames = Array.from(new Set([...shortlist, ...candidates.map((c) => c.name)]));

  const [form, setForm] = useState({
    candidate: allNames[0] ?? "",
    yield: "",
    selectivity: "",
    temp: "350",
    pressure: "18",
    loading: "0.5",
    instrument: "Agilent 7890B GC-FID",
    notes: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.candidate || !form.yield || !form.selectivity) {
      toast.error("Please fill candidate, yield and selectivity");
      return;
    }
    addLoggedResult({
      candidate: form.candidate,
      yield: Number(form.yield),
      selectivity: Number(form.selectivity),
      temp: Number(form.temp),
      pressure: Number(form.pressure),
      loading: Number(form.loading),
      instrument: form.instrument,
      notes: form.notes,
      date: new Date().toISOString().slice(0, 10),
    });

    const next = retrainCounter + 1;
    if (next >= 5) {
      const newV = `v${(parseFloat(modelVersion.replace("v", "")) + 0.1).toFixed(1)}`;
      toast.success(`Retraining triggered — model ${newV} now training.`, {
        description: "Bayesian active learning loop engaged.",
      });
    } else {
      toast.success(
        `Result logged. Model retraining queued (${next}/5 results threshold reached).`,
        { description: `Logged for ${form.candidate}` },
      );
    }

    setForm({ ...form, yield: "", selectivity: "", notes: "" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-cyan/10 border border-cyan/30 flex items-center justify-center">
          <FlaskConical className="h-5 w-5 text-cyan" />
        </div>
        <div>
          <h1 className="font-mono text-xl font-semibold">Log Experimental Results</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            Wet-lab measurements feed the active-learning loop · current threshold {retrainCounter}/5
          </p>
        </div>
      </div>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel panel-glow rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Candidate
          </Label>
          <Select value={form.candidate} onValueChange={(v) => setForm({ ...form, candidate: v })}>
            <SelectTrigger className="mt-1.5 font-mono bg-input/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allNames.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {[
          { k: "yield", l: "Measured Yield (%)", t: "number" },
          { k: "selectivity", l: "Measured Selectivity (%)", t: "number" },
          { k: "temp", l: "Temperature (°C)", t: "number" },
          { k: "pressure", l: "Pressure (bar)", t: "number" },
          { k: "loading", l: "Catalyst Loading (wt%)", t: "number" },
          { k: "instrument", l: "Instrument Used", t: "text" },
        ].map((f) => (
          <div key={f.k}>
            <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {f.l}
            </Label>
            <Input
              type={f.t}
              value={(form as any)[f.k]}
              onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
              className="mt-1.5 font-mono bg-input/60"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Researcher Notes
          </Label>
          <Textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Observations, side products, anomalies…"
            className="mt-1.5 font-mono bg-input/60 min-h-[90px]"
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-between pt-1">
          <div className="text-[11px] font-mono text-muted-foreground">
            Active model: <span className="text-cyan">{modelVersion}</span> · Retrain queue:{" "}
            <span className="text-cyan">{retrainCounter}/5</span>
          </div>
          <Button type="submit" className="btn-glow font-mono text-xs uppercase tracking-wider">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Submit Result
          </Button>
        </div>
      </motion.form>

      <div className="mt-8">
        <h2 className="font-mono text-sm uppercase tracking-wider mb-3">
          Recent Logged Results <span className="text-muted-foreground">({loggedResults.length})</span>
        </h2>
        <div className="panel rounded-lg overflow-hidden">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left px-3 py-2.5">Date</th>
                <th className="text-left px-3 py-2.5">Candidate</th>
                <th className="text-right px-3 py-2.5">Yield %</th>
                <th className="text-right px-3 py-2.5">Sel %</th>
                <th className="text-right px-3 py-2.5">T (°C)</th>
                <th className="text-right px-3 py-2.5">P (bar)</th>
                <th className="text-left px-3 py-2.5">Notes</th>
              </tr>
            </thead>
            <tbody>
              {loggedResults.map((r, i) => (
                <tr key={i} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="px-3 py-2.5 text-muted-foreground">{r.date}</td>
                  <td className="px-3 py-2.5 text-cyan">{r.candidate}</td>
                  <td className="px-3 py-2.5 text-right">{r.yield}</td>
                  <td className="px-3 py-2.5 text-right">{r.selectivity}</td>
                  <td className="px-3 py-2.5 text-right">{r.temp}</td>
                  <td className="px-3 py-2.5 text-right">{r.pressure}</td>
                  <td className="px-3 py-2.5 text-muted-foreground truncate max-w-[260px]">
                    {r.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
