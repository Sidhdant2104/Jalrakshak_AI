import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import { citizenReports } from "../data/dashboardMock";

export default function CitizenReportsPage({ onLocate }) {
  return (
    <div className="card-grid">
      {citizenReports.map((r) => (
        <Card key={r.id} eyebrow={r.id} title={r.type} action={<StatusBadge status={r.severity} />}>
          <div className="kv-list">
            <div className="kv"><span>Location</span><b>{r.location}</b></div>
            <div className="kv"><span>Status</span><b>{r.status}</b></div>
            <div className="kv"><span>Reported</span><b>{r.time}</b></div>
          </div>
          <p className="tiny-note"><b>Sensor correlation.</b> {r.correlation}</p>
          <div className="action-row">
            <button type="button" className="ghost-btn" onClick={() => onLocate(r)}>Locate on map</button>
          </div>
        </Card>
      ))}
    </div>
  );
}
