import { createFileRoute } from "@tanstack/react-router";
import { CandidateTable } from "@/components/CandidateTable";
import { ScatterPanel } from "@/components/ScatterPanel";
import { CandidateDetail } from "@/components/CandidateDetail";
import { useCatalyst } from "@/context/CatalystContext";

export const Route = createFileRoute("/results")({
  validateSearch: (search: Record<string, unknown>) => ({
    reaction: typeof search.reaction === "string" ? search.reaction : undefined,
    temp: typeof search.temp === "string" ? search.temp : undefined,
    pressure: typeof search.pressure === "string" ? search.pressure : undefined,
    family: typeof search.family === "string" ? search.family : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Results Dashboard — CatalystIQ" },
      { name: "description", content: "Ranked candidate catalysts with activity, selectivity, stability and uncertainty." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { query, candidates } = useCatalyst();
  const search = Route.useSearch();
  const displayQuery = {
    reaction: search.reaction ?? query.reaction,
    family: search.family ?? query.family,
    temp: search.temp ?? query.temp,
    pressure: search.pressure ?? query.pressure,
  };
  const shortReaction = displayQuery.reaction.split(" (")[0];
  return (
    <div className="mx-auto max-w-[1600px] px-4 md:px-6 py-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="font-mono text-xl font-semibold">Results Dashboard</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {shortReaction} · {displayQuery.family} · {displayQuery.temp}°C · {displayQuery.pressure} bar · {candidates.length} candidates returned
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-mono">
          {[
            { l: "Pipeline", v: "v3.2" },
            { l: "Pred. time", v: "3.1s" },
            { l: "Best score", v: "0.847" },
          ].map((s) => (
            <div key={s.l} className="panel rounded-md px-3 py-1.5">
              <div className="text-muted-foreground uppercase tracking-wider text-[9px]">{s.l}</div>
              <div className="text-cyan">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,30fr)_minmax(0,40fr)_minmax(0,30fr)] gap-4 min-h-[calc(100vh-180px)]">
        <section className="panel rounded-lg p-4 min-h-[480px]">
          <CandidateTable />
        </section>
        <section className="panel panel-glow rounded-lg p-4 min-h-[480px]">
          <ScatterPanel />
        </section>
        <section className="panel rounded-lg p-4 min-h-[480px]">
          <CandidateDetail />
        </section>
      </div>
    </div>
  );
}
