import { motion, AnimatePresence } from "framer-motion";
import { Box, Copy, Star, GitBranch } from "lucide-react";
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip as RTooltip,
} from "recharts";
import { Link } from "@tanstack/react-router";
import { useCatalyst } from "@/context/CatalystContext";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/SourceBadge";
import { MoleculeViewer } from "@/components/MoleculeViewer";
import { toast } from "sonner";

export function CandidateDetail() {
  const { selected, shortlist, toggleShortlist } = useCatalyst();
  const [open, setOpen] = useState(false);

  if (!selected) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground font-mono">
        Select a candidate to view details
      </div>
    );
  }

  const isShort = shortlist.includes(selected.name);
  const sortedShap = [...selected.shap].sort(
    (a, b) => Math.abs(b.value) - Math.abs(a.value),
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selected.name}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col h-full overflow-y-auto scrollbar-thin pr-1"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Candidate · Rank #{selected.rank}
            </div>
            <h3 className="font-mono text-base font-semibold mt-0.5 truncate">{selected.name}</h3>
          </div>
          <SourceBadge source={selected.source} />
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <code className="flex-1 truncate font-mono text-[11px] bg-muted/50 px-2 py-1.5 rounded border border-border">
            {selected.smiles}
          </code>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => {
              navigator.clipboard?.writeText(selected.smiles);
              toast.success("SMILES copied");
            }}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="space-y-2.5 mb-5">
          {[
            { l: "Activity", v: selected.activity },
            { l: "Selectivity", v: selected.selectivity },
            { l: "Stability", v: selected.stability },
          ].map((p) => (
            <div key={p.l}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px]">
                  {p.l}
                </span>
                <span className="font-mono text-cyan">{p.v.toFixed(3)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan to-[color:var(--purple-tag)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${p.v * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ boxShadow: "0 0 6px var(--cyan-glow)" }}
                />
              </div>
            </div>
          ))}
          <div className="text-[11px] font-mono text-muted-foreground pt-1">
            Uncertainty (MC-Dropout): <span className="text-foreground">±{selected.uncertainty}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              SHAP Feature Importance
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">top 6</div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 p-2">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={sortedShap}
                layout="vertical"
                margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
              >
                <XAxis
                  type="number"
                  domain={[-0.4, 0.5]}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  width={130}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <RTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d: any = payload[0].payload;
                    return (
                      <div className="panel rounded p-2 text-[11px] font-mono">
                        <div>{d.feature}</div>
                        <div className={d.value >= 0 ? "text-cyan" : "text-orange-400"}>
                          SHAP: {d.value > 0 ? "+" : ""}{d.value.toFixed(3)}
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[2, 2, 2, 2]} isAnimationActive>
                  {sortedShap.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.value >= 0 ? "var(--cyan)" : "#f97316"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button onClick={() => setOpen(true)} className="btn-glow text-[11px] font-mono uppercase tracking-wider">
            <Box className="h-3.5 w-3.5 mr-1.5" />
            View in 3D
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toggleShortlist(selected.name);
              toast(isShort ? "Removed from shortlist" : "Added to shortlist", {
                description: selected.name,
              });
            }}
            className="text-[11px] font-mono uppercase tracking-wider"
          >
            <Star className={`h-3.5 w-3.5 mr-1.5 ${isShort ? "fill-cyan text-cyan" : ""}`} />
            {isShort ? "Shortlisted" : "Shortlist"}
          </Button>
          <Link
            to="/provenance"
            className="col-span-2 inline-flex items-center justify-center rounded-md border border-border h-9 text-[11px] font-mono uppercase tracking-wider hover:bg-muted transition"
          >
            <GitBranch className="h-3.5 w-3.5 mr-1.5" />
            View Provenance Chain
          </Link>
        </div>

        <MoleculeViewer open={open} onOpenChange={setOpen} candidate={selected} />
      </motion.div>
    </AnimatePresence>
  );
}
