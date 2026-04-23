import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  ReferenceArea,
} from "recharts";
import { Candidate } from "@/lib/mockData";
import { SOURCE_COLORS, SourceBadge } from "@/components/SourceBadge";
import { useCatalyst } from "@/context/CatalystContext";

export function ScatterPanel() {
  const { candidates, selected, setSelected } = useCatalyst();

  const data = candidates.map((c) => ({
    x: c.selectivity,
    y: c.activity,
    z: 60 + c.stability * 240,
    candidate: c,
  }));

  // Custom shape: error-bar cross + dot
  const renderPoint = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return <g />;
    const c: Candidate = payload.candidate;
    const isSel = selected?.name === c.name;
    const r = Math.max(5, Math.sqrt(payload.z));
    const color = SOURCE_COLORS[c.source];

    // map uncertainty (data units) into pixels using axis scales available via props
    const xScale = props.xAxis?.scale;
    const yScale = props.yAxis?.scale;
    let xErrPx = 18;
    let yErrPx = 18;
    if (xScale && yScale) {
      const xZero = xScale(c.selectivity);
      const xPlus = xScale(Math.min(1, c.selectivity + c.uncertainty));
      xErrPx = Math.abs(xPlus - xZero);
      const yZero = yScale(c.activity);
      const yPlus = yScale(Math.min(1, c.activity + c.uncertainty));
      yErrPx = Math.abs(yPlus - yZero);
    }

    return (
      <g
        style={{ cursor: "pointer" }}
        onClick={() => setSelected(c)}
      >
        {/* horizontal error bar */}
        <line
          x1={cx - xErrPx}
          x2={cx + xErrPx}
          y1={cy}
          y2={cy}
          stroke="var(--cyan)"
          strokeWidth={2}
          opacity={0.85}
        />
        <line x1={cx - xErrPx} x2={cx - xErrPx} y1={cy - 4} y2={cy + 4} stroke="var(--cyan)" strokeWidth={2} opacity={0.85} />
        <line x1={cx + xErrPx} x2={cx + xErrPx} y1={cy - 4} y2={cy + 4} stroke="var(--cyan)" strokeWidth={2} opacity={0.85} />
        {/* vertical error bar */}
        <line
          x1={cx}
          x2={cx}
          y1={cy - yErrPx}
          y2={cy + yErrPx}
          stroke="var(--cyan)"
          strokeWidth={2}
          opacity={0.85}
        />
        <line x1={cx - 4} x2={cx + 4} y1={cy - yErrPx} y2={cy - yErrPx} stroke="var(--cyan)" strokeWidth={2} opacity={0.85} />
        <line x1={cx - 4} x2={cx + 4} y1={cy + yErrPx} y2={cy + yErrPx} stroke="var(--cyan)" strokeWidth={2} opacity={0.85} />

        {/* point */}
        {isSel && (
          <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="var(--cyan)" strokeWidth={2}>
            <animate attributeName="r" from={r + 2} to={r + 10} dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.9" to="0" dur="1.4s" repeatCount="indefinite" />
          </circle>
        )}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={color}
          fillOpacity={0.85}
          stroke={isSel ? "var(--cyan)" : "oklch(1 0 0 / 0.4)"}
          strokeWidth={isSel ? 2.5 : 1}
          style={{
            filter: isSel
              ? `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 6px var(--cyan-glow))`
              : `drop-shadow(0 0 4px ${color})`,
          }}
        />
      </g>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-mono text-sm uppercase tracking-wider">Performance Landscape</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Activity × Selectivity · point size = stability · cyan bars = MC-Dropout uncertainty
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          {(["OCP", "MolGPT", "Perturbed"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: SOURCE_COLORS[s], boxShadow: `0 0 6px ${SOURCE_COLORS[s]}` }}
              />
              <span className="text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[420px]">
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <defs>
              <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.6" fill="oklch(0.5 0.04 250 / 0.25)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" opacity={0.5} />

            <ReferenceArea
              x1={0.7}
              x2={1}
              y1={0.7}
              y2={1}
              fill="var(--cyan)"
              fillOpacity={0.05}
              stroke="var(--cyan)"
              strokeOpacity={0.4}
              strokeDasharray="3 3"
              label={{
                value: "★ HIGH ACTIVITY / HIGH SELECTIVITY",
                position: "insideTopRight",
                fill: "var(--cyan)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
            />

            <XAxis
              type="number"
              dataKey="x"
              domain={[0.5, 1]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              stroke="var(--border)"
              label={{
                value: "Selectivity Score",
                position: "insideBottom",
                offset: -10,
                fill: "var(--muted-foreground)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0.5, 1]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              stroke="var(--border)"
              label={{
                value: "Activity Score (TOF proxy)",
                angle: -90,
                position: "insideLeft",
                fill: "var(--muted-foreground)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
            />
            <ZAxis dataKey="z" range={[60, 300]} />
            <Tooltip
              cursor={{ stroke: "var(--cyan)", strokeOpacity: 0.3, strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const c: Candidate = payload[0].payload.candidate;
                return (
                  <div className="panel rounded-md p-3 text-xs font-mono shadow-xl">
                    <div className="font-semibold text-foreground">{c.name}</div>
                    <div className="mt-1.5 space-y-0.5 text-muted-foreground">
                      <div>Activity: <span className="text-cyan">{c.activity.toFixed(3)}</span></div>
                      <div>Selectivity: <span className="text-cyan">{c.selectivity.toFixed(3)}</span></div>
                      <div>Stability: <span className="text-cyan">{c.stability.toFixed(3)}</span></div>
                      <div>Uncertainty: ±{c.uncertainty}</div>
                      <div className="pt-1">Source: <SourceBadge source={c.source} /></div>
                    </div>
                  </div>
                );
              }}
            />
            <Scatter data={data} shape={renderPoint as any} isAnimationActive animationDuration={700} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
