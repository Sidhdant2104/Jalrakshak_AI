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
  const w = 640;
  const h = 200;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (w - 28) + 14;
    const y = h - 28 - ((v - min) / span) * (h - 48);
    return [x, y];
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const fill = `${d} L${pts[pts.length - 1][0]},${h - 20} L${pts[0][0]},${h - 20} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg">
      <path d={fill} fill="rgba(109,124,255,0.12)" />
      <path d={d} fill="none" stroke="#818cf8" strokeWidth="2.4" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#c4b5fd" />)}
      {labels.map((lab, i) => (
        <text key={lab + i} x={pts[i][0]} y={h - 6} textAnchor="middle" fontSize="11" fill="#8ea0c3">{lab}</text>
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
          <button key={r} type="button" className={!custom && range === r ? "chip active" : "chip"} onClick={() => { setCustom(false); setRange(r); }}>
            {r === "7d" ? "7D" : r === "30d" ? "30D" : "24H"}
          </button>
        ))}
        <button type="button" className={custom ? "chip active" : "chip"} onClick={() => setCustom(true)}>CUSTOM</button>
      </div>
      <div className="toolbar">
        {PARAMS.map(([id, label]) => (
          <button key={id} type="button" className={param === id ? "chip active" : "chip"} onClick={() => setParam(id)}>{label}</button>
        ))}
      </div>
      <Card eyebrow="Trend" title={PARAMS.find((p) => p[0] === param)[1]}>
        <Chart labels={series.labels} values={values} />
        <p className="tiny-note">{custom ? "Custom uses the 7-day demo series until a backend exists." : "Demo series for presentation."}</p>
      </Card>
    </div>
  );
}
