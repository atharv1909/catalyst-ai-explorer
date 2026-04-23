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
    z: 80 + c.stability * 280,
    candidate: c,
  }));

  // Custom shape: error-bar cross + dot
  const renderPoint = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return <g />;
    const c: Candidate = payload.candidate;
    const isSel = selected?.name === c.name;
    const r = Math.max(7, Math.sqrt(payload.z) * 0.85);
    const color = SOURCE_COLORS[c.source];

    // map uncertainty (data units) into pixels using axis scales available via props
    const xScale = props.xAxis?.scale;
    const yScale = props.yAxis?.scale;
    let xErrPx = 22;
    let yErrPx = 22;
    if (xScale && yScale) {
      const xZero = xScale(c.selectivity);
      const xPlus = xScale(Math.min(1, c.selectivity + c.uncertainty));
      xErrPx = Math.abs(xPlus - xZero);
      const yZero = yScale(c.activity);
      const yPlus = yScale(Math.min(1, c.activity + c.uncertainty));
      yErrPx = Math.abs(yPlus - yZero);
    }

    const errColor = "#22d3ee";
    const errOpacity = isSel ? 1 : 0.7;
    const errWidth = isSel ? 2.5 : 1.75;

    return (
      <g style={{ cursor: "pointer" }} onClick={() => setSelected(c)}>
        {/* horizontal error bar */}
        <line x1={cx - xErrPx} x2={cx + xErrPx} y1={cy} y2={cy} stroke={errColor} strokeWidth={errWidth} opacity={errOpacity} strokeLinecap="round" />
        <line x1={cx - xErrPx} x2={cx - xErrPx} y1={cy - 5} y2={cy + 5} stroke={errColor} strokeWidth={errWidth} opacity={errOpacity} strokeLinecap="round" />
        <line x1={cx + xErrPx} x2={cx + xErrPx} y1={cy - 5} y2={cy + 5} stroke={errColor} strokeWidth={errWidth} opacity={errOpacity} strokeLinecap="round" />
        {/* vertical error bar */}
        <line x1={cx} x2={cx} y1={cy - yErrPx} y2={cy + yErrPx} stroke={errColor} strokeWidth={errWidth} opacity={errOpacity} strokeLinecap="round" />
        <line x1={cx - 5} x2={cx + 5} y1={cy - yErrPx} y2={cy - yErrPx} stroke={errColor} strokeWidth={errWidth} opacity={errOpacity} strokeLinecap="round" />
        <line x1={cx - 5} x2={cx + 5} y1={cy + yErrPx} y2={cy + yErrPx} stroke={errColor} strokeWidth={errWidth} opacity={errOpacity} strokeLinecap="round" />

        {/* point */}
        {isSel && (
          <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#22d3ee" strokeWidth={2}>
            <animate attributeName="r" from={r + 2} to={r + 14} dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.9" to="0" dur="1.4s" repeatCount="indefinite" />
          </circle>
        )}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={color}
          fillOpacity={0.95}
          stroke={isSel ? "#ffffff" : "rgba(255,255,255,0.55)"}
          strokeWidth={isSel ? 2.5 : 1.25}
          style={{
            filter: isSel
              ? `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 8px #22d3ee)`
              : `drop-shadow(0 0 6px ${color})`,
          }}
        />
        {/* rank label */}
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fontSize={Math.max(9, r * 0.75)}
          fontFamily="var(--font-mono)"
          fontWeight={700}
          fill="#0a0f1e"
          style={{ pointerEvents: "none" }}
        >
          {c.rank}
        </text>
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

      <div className="flex-1 min-h-[460px]">
        <ResponsiveContainer width="100%" height={480}>
          <ScatterChart margin={{ top: 24, right: 28, bottom: 56, left: 56 }}>
            <CartesianGrid stroke="oklch(0.35 0.04 250 / 0.5)" strokeDasharray="3 5" />

            <ReferenceArea
              x1={0.75}
              x2={1}
              y1={0.75}
              y2={1}
              fill="#22d3ee"
              fillOpacity={0.08}
              stroke="#22d3ee"
              strokeOpacity={0.55}
              strokeDasharray="4 4"
              label={{
                value: "★ STAR ZONE — High Activity & Selectivity",
                position: "insideTopRight",
                fill: "#22d3ee",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}
            />

            <XAxis
              type="number"
              dataKey="x"
              domain={[0.5, 1]}
              ticks={[0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
              tickFormatter={(v) => v.toFixed(2)}
              tick={{ fill: "oklch(0.85 0.02 250)", fontSize: 12, fontFamily: "var(--font-mono)" }}
              stroke="oklch(0.5 0.04 250)"
              tickLine={{ stroke: "oklch(0.5 0.04 250)" }}
              label={{
                value: "Selectivity Score  →",
                position: "insideBottom",
                offset: -18,
                fill: "oklch(0.85 0.02 250)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0.5, 1]}
              ticks={[0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
              tickFormatter={(v) => v.toFixed(2)}
              tick={{ fill: "oklch(0.85 0.02 250)", fontSize: 12, fontFamily: "var(--font-mono)" }}
              stroke="oklch(0.5 0.04 250)"
              tickLine={{ stroke: "oklch(0.5 0.04 250)" }}
              label={{
                value: "Activity Score (TOF proxy)  →",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                fill: "oklch(0.85 0.02 250)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}
            />
            <ZAxis dataKey="z" range={[80, 360]} />
            <Tooltip
              cursor={{ stroke: "#22d3ee", strokeOpacity: 0.4, strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const c: Candidate = payload[0].payload.candidate;
                return (
                  <div className="panel rounded-md p-3 text-xs font-mono shadow-xl">
                    <div className="font-semibold text-foreground">#{c.rank} · {c.name}</div>
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
