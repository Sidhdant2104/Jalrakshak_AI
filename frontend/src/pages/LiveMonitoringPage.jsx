import Card from "../components/ui/Card";
import Sparkline from "../components/ui/Sparkline";
import StatusBadge from "../components/ui/StatusBadge";
import NetworkMap from "../components/network/NetworkMap";
import { qualityParams } from "../data/dashboardMock";
import { statusColor } from "../utils/status";

export default function LiveMonitoringPage({ onLocate }) {
  return (
    <div className="two-col">
      <Card eyebrow="Live feed" title="Network pulse">
        <div className="map-embed tall">
          <NetworkMap compact onSelect={(sel) => onLocate(sel)} />
        </div>
      </Card>
      <Card eyebrow="Streaming" title="Parameter watch">
        <div className="live-params">
          {qualityParams.map((p) => (
            <div key={p.id} className="live-row">
              <div>
                <strong>{p.label}</strong>
                <StatusBadge status={p.status} />
              </div>
              <b>{p.value} {p.unit}</b>
              <Sparkline data={p.spark} color={statusColor(p.status)} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
