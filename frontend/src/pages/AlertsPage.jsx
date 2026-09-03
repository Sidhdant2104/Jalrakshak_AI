import { useState } from "react";
import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import { alerts } from "../data/dashboardMock";

export default function AlertsPage({ onLocate }) {
  const [open, setOpen] = useState(alerts[0].id);
  const [resolved, setResolved] = useState({});
  const current = alerts.find((a) => a.id === open);
  return (
    <div className="two-col alerts-layout">
      <Card eyebrow="Queue" title="Incidents" padded={false}>
        <ul className="alert-list tall">
          {alerts.map((a) => (
            <li key={a.id} className={open === a.id ? "selected" : ""} onClick={() => setOpen(a.id)}>
              <span className={`sev sev-${a.severity.toLowerCase()}`} />
              <div>
                <strong>{a.title}</strong>
                <p>{a.location} · {a.timestamp}{resolved[a.id] ? " · Resolved" : ""}</p>
              </div>
              <StatusBadge status={a.severity} />
            </li>
          ))}
        </ul>
      </Card>
      <Card eyebrow={current.id} title={current.title}>
        <div className="kv-list">
          <div className="kv"><span>Severity</span><b><StatusBadge status={current.severity} /></b></div>
          <div className="kv"><span>Location</span><b>{current.location}</b></div>
          <div className="kv"><span>Parameter</span><b>{current.parameter}</b></div>
          <div className="kv"><span>Current value</span><b>{current.value}</b></div>
          <div className="kv"><span>Threshold</span><b>{current.range}</b></div>
        </div>
        <p><b>Possible cause.</b> {current.cause}</p>
        <p><b>AI recommendation.</b> {current.recommendation}</p>
        <div className="action-row">
          <button type="button" className="primary-btn" onClick={() => onLocate(current)}>Locate on map</button>
          <button type="button" className="ghost-btn">Investigate</button>
          <button type="button" className="ghost-btn" onClick={() => setResolved((s) => ({ ...s, [current.id]: true }))}>Resolve</button>
        </div>
      </Card>
    </div>
  );
}
