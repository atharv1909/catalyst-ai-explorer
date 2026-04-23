import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Cpu, TrendingDown } from "lucide-react";
import { modelVersions } from "@/lib/mockData";
import { useCatalyst } from "@/context/CatalystContext";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "Model Versions — CatalystIQ" },
      { name: "description", content: "MLflow registry of Chemprop model versions and active-learning queue." },
    ],
  }),
  component: ModelsPage,
});

function ModelsPage() {
  const { candidates } = useCatalyst();
  const al = [...candidates].sort((a, b) => b.uncertainty - a.uncertainty).slice(0, 3);
  const maeData = [...modelVersions].reverse().map((m) => ({ version: m.version, mae: m.mae }));

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-cyan/10 border border-cyan/30 flex items-center justify-center">
          <Cpu className="h-5 w-5 text-cyan" />
        </div>
        <div>
          <h1 className="font-mono text-xl font-semibold">Model Registry · MLflow</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            Chemprop predictive models · auto-retrain on 5 wet-lab results
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[
          { l: "Active version", v: "v3.2", s: "deployed 4 d ago" },
          { l: "Validation MAE", v: "0.041", s: "−14.6% vs v3.1" },
          { l: "Training samples", v: "1,842", s: "+17 since v3.0" },
        ].map((s) => (
          <div key={s.l} className="panel panel-glow rounded-lg p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {s.l}
            </div>
            <div className="font-mono text-2xl text-cyan mt-1 glow-text">{s.v}</div>
            <div className="text-[11px] text-muted-foreground font-mono mt-1">{s.s}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-6">
        <div className="panel rounded-lg p-4">
          <h2 className="font-mono text-sm uppercase tracking-wider mb-1">Version History</h2>
          <p className="text-xs text-muted-foreground font-mono mb-3">
            Trained on cumulative experimental data
          </p>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left px-2 py-2">Ver</th>
                <th className="text-left px-2 py-2">Date</th>
                <th className="text-right px-2 py-2">MAE</th>
                <th className="text-right px-2 py-2">Samples</th>
                <th className="text-left px-2 py-2">Trigger</th>
                <th className="text-left px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {modelVersions.map((m) => (
                <tr key={m.version} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="px-2 py-2.5 text-cyan">{m.version}</td>
                  <td className="px-2 py-2.5 text-muted-foreground">{m.date}</td>
                  <td className="px-2 py-2.5 text-right">{m.mae.toFixed(3)}</td>
                  <td className="px-2 py-2.5 text-right">{m.dataSize.toLocaleString()}</td>
                  <td className="px-2 py-2.5 text-muted-foreground">{m.trigger}</td>
                  <td className="px-2 py-2.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                        m.status === "Active"
                          ? "text-cyan border-cyan/40 bg-cyan/10"
                          : "text-muted-foreground border-border bg-muted/30"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-mono text-sm uppercase tracking-wider">Validation MAE</h2>
            <TrendingDown className="h-4 w-4 text-cyan" />
          </div>
          <p className="text-xs text-muted-foreground font-mono mb-3">
            Lower is better · across registered versions
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={maeData} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" opacity={0.4} />
              <XAxis
                dataKey="version"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                stroke="var(--border)"
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                stroke="var(--border)"
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d: any = payload[0].payload;
                  return (
                    <div className="panel rounded p-2 text-[11px] font-mono">
                      <div>{d.version}</div>
                      <div className="text-cyan">MAE: {d.mae.toFixed(3)}</div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="mae" radius={[4, 4, 0, 0]}>
                {maeData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={i === maeData.length - 1 ? "var(--cyan)" : "color-mix(in oklab, var(--cyan) 35%, var(--muted))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel panel-glow rounded-lg p-4">
        <h2 className="font-mono text-sm uppercase tracking-wider mb-1">Active Learning Queue</h2>
        <p className="text-xs text-muted-foreground font-mono mb-4">
          Highest-uncertainty candidates recommended for next experiment
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {al.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-md border border-border bg-muted/20 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Priority #{i + 1}
                </span>
                <span className="font-mono text-xs text-cyan">±{c.uncertainty}</span>
              </div>
              <div className="font-mono text-sm font-semibold mb-2">{c.name}</div>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                <Stat l="Act" v={c.activity} />
                <Stat l="Sel" v={c.selectivity} />
                <Stat l="Stab" v={c.stability} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ l, v }: { l: string; v: number }) {
  return (
    <div className="rounded bg-background/60 border border-border px-1.5 py-1">
      <div className="text-muted-foreground uppercase">{l}</div>
      <div className="text-cyan">{v.toFixed(3)}</div>
    </div>
  );
}
