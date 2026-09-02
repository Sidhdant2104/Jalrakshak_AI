import Card from "../components/ui/Card";
import { sensorHealth } from "../data/dashboardMock";
import { prototypeNetwork } from "../data/prototypeNetwork";

export default function SensorsPage() {
  const nodes = prototypeNetwork.nodes.filter((n) => n.type === "SENSORS");

  return (
    <div className="card-grid">
      {nodes.map((node) => {
        const health = sensorHealth.find((s) => s.id === node.id);
        return (
          <Card key={node.id} eyebrow={node.id} title={node.name}>
            <div className="detail-grid">
              <div className="detail-metric">
                <span>Status</span>
                <strong>{node.status === "ONLINE" ? "Online" : node.status}</strong>
              </div>
              <div className="detail-metric">
                <span>Device ID</span>
                <strong>{node.device_id}</strong>
              </div>
              <div className="detail-metric">
                <span>Battery</span>
                <strong>{health?.battery} (demo)</strong>
              </div>
              <div className="detail-metric">
                <span>Signal</span>
                <strong>{health?.signal} (demo)</strong>
              </div>
              <div className="detail-metric">
                <span>Last reading</span>
                <strong>{health?.lastReading}</strong>
              </div>
              <div className="detail-metric">
                <span>Calibration</span>
                <strong>{health?.calibration} (demo)</strong>
              </div>
            </div>
            <p className="tiny-note">{health?.note}</p>
            <p className="tiny-note">Location uses the node’s prototypeNetwork.js position. It is not copied into this panel.</p>
          </Card>
        );
      })}
    </div>
  );
}
