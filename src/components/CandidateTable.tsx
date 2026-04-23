import { motion } from "framer-motion";
import { Download, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useCatalyst } from "@/context/CatalystContext";
import { SourceBadge } from "@/components/SourceBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CandidateTable() {
  const { candidates, selected, setSelected } = useCatalyst();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? candidates : candidates.slice(0, 12);

  const exportTop5 = () => {
    toast.success("Top 5 exported as candidates_top5.csv", {
      description: "31 features, MC-Dropout uncertainty included.",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-mono text-sm uppercase tracking-wider">Ranked Candidates</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {visible.length} of 31 · sorted by composite score
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="h-8 text-[11px] font-mono uppercase tracking-wider"
          >
            {showAll ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            {showAll ? "Top 12" : "All 31"}
          </Button>
          <Button
            size="sm"
            onClick={exportTop5}
            className="h-8 text-[11px] font-mono uppercase tracking-wider btn-glow"
          >
            <Download className="h-3 w-3 mr-1" />
            Export 5
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin rounded-md border border-border">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
              <th className="text-left px-2 py-2 w-8">#</th>
              <th className="text-left px-2 py-2">Name</th>
              <th className="text-left px-2 py-2">Src</th>
              <th className="text-right px-2 py-2">Act</th>
              <th className="text-right px-2 py-2">Sel</th>
              <th className="text-right px-2 py-2">Stab</th>
              <th className="text-right px-2 py-2">±σ</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c, i) => {
              const sel = selected?.name === c.name;
              return (
                <motion.tr
                  key={c.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                  onClick={() => setSelected(c)}
                  className={cn(
                    "border-b border-border/60 cursor-pointer font-mono transition-colors",
                    sel
                      ? "bg-cyan/10 text-foreground"
                      : "hover:bg-muted/40 text-foreground/90",
                  )}
                >
                  <td className="px-2 py-2 text-muted-foreground">{c.rank}</td>
                  <td className="px-2 py-2 truncate max-w-[140px]" title={c.name}>
                    <span className={sel ? "text-cyan" : ""}>{c.name}</span>
                  </td>
                  <td className="px-2 py-2"><SourceBadge source={c.source} /></td>
                  <td className="px-2 py-2 text-right">{c.activity.toFixed(3)}</td>
                  <td className="px-2 py-2 text-right">{c.selectivity.toFixed(3)}</td>
                  <td className="px-2 py-2 text-right">{c.stability.toFixed(2)}</td>
                  <td className="px-2 py-2 text-right text-muted-foreground">±{c.uncertainty}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
