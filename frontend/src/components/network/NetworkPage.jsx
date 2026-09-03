import { lazy, Suspense, useMemo, useState } from "react";
import NetworkMap from "./NetworkMap";
import NetworkDetails from "./NetworkDetails";
import { prototypeNetwork } from "../../data/prototypeNetwork";

const NetworkMap3D = lazy(() => import("./NetworkMap3D"));

const LEGEND = [
  ["Healthy", "ok"],
  ["Warning", "warn"],
  ["Critical", "crit"],
  ["Offline", "off"],
];

export default function NetworkPage({ selection, onSelect, focusToken = 0 }) {
  const [mode, setMode] = useState("3d");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [layers, setLayers] = useState({ zones: true, sensors: true, infra: true, pipes: true });
  const [grid, setGrid] = useState(true);
  const [flow, setFlow] = useState(true);
  const [command, setCommand] = useState({ type: "fit", n: 0 });

  const catalog = useMemo(() => {
    const items = [
      ...prototypeNetwork.nodes.map((n) => ({
        id: n.id,
        label: `${n.name} (${n.id})`,
        kind: n.type === "ZONE" ? "zone" : n.type === "SENSORS" ? "sensor" : "node",
        data: n,
      })),
      ...prototypeNetwork.pipelines.map((p) => ({
        id: p.id,
        label: `${p.id} ${p.from} → ${p.to}`,
        kind: "pipeline",
        data: p,
      })),
    ];
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  const fire = (type) => setCommand({ type, n: Date.now() });
  const toggle = (key) => setLayers((s) => ({ ...s, [key]: !s[key] }));
  const pick = (item) => {
    onSelect({ kind: item.kind, id: item.id, data: item.data });
    setQuery("");
  };

  return (
    <div className="network-stage">
      <div className="map-hud">
        <div className="hud-brand">
          <div>
            <p className="kicker">Network map</p>
            <strong>Schematic infrastructure</strong>
          </div>
          <span className="live-pill">
            <i className="live-dot" /> Live
          </span>
        </div>

        <div className="search-wrap hud-search">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search network…" />
          {catalog.length > 0 && (
            <ul className="search-hits">
              {catalog.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => pick(item)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="view-toggle" role="tablist" aria-label="Map projection">
          <button type="button" className={mode === "3d" ? "on" : ""} onClick={() => setMode("3d")}>
            3D
          </button>
          <button type="button" className={mode === "2d" ? "on" : ""} onClick={() => setMode("2d")}>
            2D
          </button>
        </div>

        <div className="seg" title="Layers">
          <button type="button" className={layers.zones ? "on" : ""} onClick={() => toggle("zones")}>Zones</button>
          <button type="button" className={layers.sensors ? "on" : ""} onClick={() => toggle("sensors")}>Sensors</button>
          <button type="button" className={layers.infra ? "on" : ""} onClick={() => toggle("infra")}>Nodes</button>
          <button type="button" className={layers.pipes ? "on" : ""} onClick={() => toggle("pipes")}>Pipelines</button>
          <button type="button" className={grid ? "on" : ""} onClick={() => setGrid((v) => !v)}>Grid</button>
          <button type="button" className={flow ? "on" : ""} onClick={() => setFlow((v) => !v)}>Flow</button>
        </div>

        <div className="seg" title="Filters">
          {["all", "healthy", "warning", "critical", "offline"].map((f) => (
            <button key={f} type="button" className={statusFilter === f ? "on" : ""} onClick={() => setStatusFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        <div className="seg">
          <button type="button" onClick={() => fire("in")}>Zoom in</button>
          <button type="button" onClick={() => fire("out")}>Zoom out</button>
          <button type="button" onClick={() => fire("reset")}>Reset</button>
          <button type="button" onClick={() => fire("fit")}>Fit</button>
        </div>

        <div className="map-legend-row tight hud-legend">
          {LEGEND.map(([label, tone]) => (
            <span key={label} className="legend-item">
              <i className={`legend-dot ${tone}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="network-fullscreen">
        <div className="map-frame">
          {mode === "3d" ? (
            <Suspense fallback={<div className="map-canvas map-3d"><p className="muted" style={{ padding: 16 }}>Loading 3D network…</p></div>}>
              <NetworkMap3D
                selectedId={selection?.id}
                onSelect={onSelect}
                layers={layers}
                statusFilter={statusFilter}
                focusId={selection?.id}
                focusToken={focusToken}
                command={command}
                flow={flow}
                grid={grid}
              />
            </Suspense>
          ) : (
            <NetworkMap
              selectedId={selection?.id}
              onSelect={onSelect}
              layers={layers}
              statusFilter={statusFilter}
              focusId={selection?.id}
              focusToken={focusToken}
              command={command}
            />
          )}
        </div>
        <NetworkDetails selection={selection} onClose={() => onSelect(null)} />
      </div>
    </div>
  );
}
