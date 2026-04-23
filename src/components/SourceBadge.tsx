import { Candidate, Source } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const SOURCE_COLORS: Record<Source, string> = {
  OCP: "var(--blue-tag)",
  MolGPT: "var(--purple-tag)",
  Perturbed: "var(--teal-tag)",
};

export function SourceBadge({ source, className }: { source: Source; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border",
        className,
      )}
      style={{
        color: SOURCE_COLORS[source],
        borderColor: `color-mix(in oklab, ${SOURCE_COLORS[source]} 50%, transparent)`,
        background: `color-mix(in oklab, ${SOURCE_COLORS[source]} 12%, transparent)`,
      }}
    >
      {source}
    </span>
  );
}

export function compositeColor(c: Candidate) {
  return SOURCE_COLORS[c.source];
}
