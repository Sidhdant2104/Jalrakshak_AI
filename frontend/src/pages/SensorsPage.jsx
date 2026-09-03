import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import { sensorHealth, sensorInventory } from "../data/dashboardMock";
import { prototypeNetwork } from "../data/prototypeNetwork";

const TYPE_ICON_HINT = {
  Turbidity: "Turbidity ×2 across SN1 / SN2",
  TDS: "TDS ×2 across SN1 / SN2",
  Flow: "Flow ×2 across SN1 / SN2",
  Temperature: "Temperature ×2 across SN1 / SN2",
};

export default function SensorsPage({ onLocate }) {
  const nodes = prototypeNetwork.nodes.filter((n) => n.type === "SENSORS");

  return (
    <div className="stack">
      <Card eyebrow="Physical scope" title="2 nodes · 8 sensors">
        <p className="muted" style={{ margin: 0 }}>
          Turbidity ×2 · TDS ×2 · Flow ×2 · Temperature ×2 on SN1 and SN2 (shared ESP-32-001).
          Network Map geometry is locked and unchanged.
        </p>
      </Card>

      <div className="two-col">
        {nodes.map((node) => {
          const health = sensorHealth.find((s) => s.id === node.id);
          const channels = sensorInventory.filter((s) => s.nodeId === node.id);
          return (
            <Card key={node.id} eyebrow={node.id} title={node.name}>
              <div className="kv-list">
                <div className="kv"><span>Node ID</span><b>{node.id}</b></div>
                <div className="kv"><span>Device ID</span><b>{node.device_id || health?.deviceId}</b></div>
                <div className="kv"><span>Sensors on node</span><b>{channels.length}</b></div>
                <div className="kv"><span>Status</span><b>{node.status === "ONLINE" ? "Online" : node.status}</b></div>
                <div className="kv"><span>Battery</span><b>{health?.battery} (demo)</b></div>
                <div className="kv"><span>Signal</span><b>{health?.signal} (demo)</b></div>
                <div className="kv"><span>Last reading</span><b>{health?.lastReading}</b></div>
              </div>
              <p className="tiny-note">{health?.note}</p>
              <div className="action-row">
                <button type="button" className="ghost-btn" onClick={() => onLocate({ kind: "sensor", id: node.id, data: node })}>
                  Locate on map
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card eyebrow="Sensor inventory" title="All 8 channels">
        <div className="card-grid">
          {sensorInventory.map((sensor) => (
            <article key={sensor.id} className="param-card">
              <header>
                <span>{sensor.type}</span>
                <StatusBadge status={sensor.status} />
              </header>
              <strong>
                {sensor.value}
                <em>{sensor.unit}</em>
              </strong>
              <p>
                {sensor.id} · Node {sensor.nodeId}
              </p>
              <p className="tiny-note">
                Range {sensor.range} · {sensor.lastReading} · {TYPE_ICON_HINT[sensor.type]}
              </p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
