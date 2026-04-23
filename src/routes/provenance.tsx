import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import { useCatalyst } from "@/context/CatalystContext";
import { provenanceFor } from "@/lib/mockData";

export const Route = createFileRoute("/provenance")({
  head: () => ({
    meta: [
      { title: "Provenance Chain — CatalystIQ" },
      { name: "description", content: "Full lineage of a candidate from database entry to retrained model." },
    ],
  }),
  component: ProvPage,
});

function ProvPage() {
  const { selected } = useCatalyst();
  const candidate = selected;
  const nodes = provenanceFor(candidate?.name ?? "ZSM-5-Zn-0.5wt%");

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-cyan/10 border border-cyan/30 flex items-center justify-center">
          <GitBranch className="h-5 w-5 text-cyan" />
        </div>
        <div>
          <h1 className="font-mono text-xl font-semibold">Provenance Chain</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            Full lineage for{" "}
            <span className="text-cyan">{candidate?.name ?? "—"}</span>
          </p>
        </div>
      </div>

      <div className="relative pl-10">
        <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan/60 via-border to-cyan/30" />
        {nodes.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative mb-4 last:mb-0"
          >
            <span className="absolute -left-10 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card border border-cyan/40 text-[10px] font-mono font-bold text-cyan shadow-[0_0_10px_var(--cyan-glow)]">
              {n.icon}
            </span>
            <div className="panel rounded-lg p-4 hover:panel-glow transition-all">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-sm font-semibold">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">{n.desc}</div>
                </div>
                <div className="text-[10px] font-mono text-cyan whitespace-nowrap">{n.ts}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
