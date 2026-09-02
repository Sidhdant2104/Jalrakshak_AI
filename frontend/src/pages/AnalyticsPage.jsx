import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import { analyticsSeries } from "../data/dashboardMock";

const PARAMS = [
  ["ph", "pH"],
  ["turbidity", "Turbidity"],
  ["tds", "TDS"],
  ["chlorine", "Chlorine"],
  ["temperature", "Temperature"],
  ["pressure", "Pressure"],
  ["flow", "Flow"],
  ["wqi", "Water Quality Index"],
];

function Chart({ labels, values }) {
  const w = 560;
  const h = 180;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (w - 24) + 12;
    const y = h - 24 - ((v - min) / span) * (h - 40);
    return [x, y];
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const fill = `${d} L${pts[pts.length - 1][0]},${h - 16} L${pts[0][0]},${h - 16} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg">
      <path d={fill} fill="rgba(96,165,250,0.12)" />
      <path d={d} fill="none" stroke="#60a5fa" strokeWidth="2.5" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#93c5fd" />
      ))}
      {labels.map((lab, i) => (
        <text key={lab + i} x={pts[i][0]} y={h - 4} textAnchor="middle" fontSize="11" fill="#8ea0c3">
          {lab}
        </text>
      ))}
    </svg>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("24h");
  const [param, setParam] = useState("turbidity");
  const [custom, setCustom] = useState(false);
  const series = analyticsSeries[custom ? "7d" : range] || analyticsSeries["24h"];
  const values = useMemo(() => series[param], [series, param]);

  return (
    <div className="stack">
      <div className="toolbar">
        {["24h", "7d", "30d"].map((r) => (
          <button
            key={r}
            type="button"
            className={!custom && range === r ? "chip active" : "chip"}
            onClick={() => {
              setCustom(false);
              setRange(r);
            }}
          >
            {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "24h"}
          </button>
        ))}
        <button type="button" className={custom ? "chip active" : "chip"} onClick={() => setCustom(true)}>
          Custom
        </button>
      </div>
      <div className="toolbar wrap">
        {PARAMS.map(([id, label]) => (
          <button key={id} type="button" className={param === id ? "chip active" : "chip"} onClick={() => setParam(id)}>
            {label}
          </button>
        ))}
      </div>
      <Card eyebrow="Trend" title={PARAMS.find((p) => p[0] === param)[1]}>
        <Chart labels={series.labels} values={values} />
        <p className="tiny-note">
          {custom ? "Custom range uses the 7-day demo series until a backend exists." : "Demo series for presentation."}
        </p>
      </Card>
    </div>
  );
}
