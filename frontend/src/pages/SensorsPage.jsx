import Card from "../components/ui/Card";
import { sensorHealth } from "../data/dashboardMock";
import { prototypeNetwork } from "../data/prototypeNetwork";

export default function SensorsPage({ onLocate }) {
  const nodes = prototypeNetwork.nodes.filter((n) => n.type === "SENSORS");
  return (
    <div className="card-grid">
      {nodes.map((node) => {
        const health = sensorHealth.find((s) => s.id === node.id);
        return (
          <Card key={node.id} eyebrow={node.id} title={node.name}>
            <div className="kv-list">
              <div className="kv"><span>Sensor ID</span><b>{node.id}</b></div>
              <div className="kv"><span>Device ID</span><b>{node.device_id}</b></div>
              <div className="kv"><span>Type</span><b>{node.type}</b></div>
              <div className="kv"><span>Status</span><b>{node.status === "ONLINE" ? "Online" : node.status}</b></div>
              <div className="kv"><span>Battery</span><b>{health?.battery} (demo)</b></div>
              <div className="kv"><span>Signal</span><b>{health?.signal} (demo)</b></div>
              <div className="kv"><span>Last reading</span><b>{health?.lastReading}</b></div>
              <div className="kv"><span>Location</span><b>Schematic node {node.id}</b></div>
              <div className="kv"><span>Health</span><b>Nominal</b></div>
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
  );
}
