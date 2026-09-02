import NetworkMap from "./NetworkMap";
import NetworkDetails from "./NetworkDetails";

const LEGEND = [
  ["Healthy / normal", "ok"],
  ["Warning", "warn"],
  ["Critical / leakage", "crit"],
  ["Contamination", "contam"],
  ["Offline", "off"],
];

export default function NetworkPage({ selection, onSelect }) {
  return (
    <div className="network-stage">
      <div className="map-legend-row">
        {LEGEND.map(([label, tone]) => (
          <span key={label} className="legend-item">
            <i className={`legend-dot ${tone}`} />
            {label}
          </span>
        ))}
        <span className="legend-note">View zoom only — coordinates are locked</span>
      </div>
      <div className="network-fullscreen">
        <div className="map-frame">
          <NetworkMap selectedId={selection?.id} onSelect={onSelect} />
        </div>
        <aside className="network-side">
          <NetworkDetails selection={selection} />
        </aside>
      </div>
    </div>
  );
}
