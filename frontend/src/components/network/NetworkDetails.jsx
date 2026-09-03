import Sparkline from "../ui/Sparkline";
import StatusBadge from "../ui/StatusBadge";
import { alerts, nodeTelemetry, pipelineTelemetry, zoneTelemetry } from "../../data/dashboardMock";
import { prototypeNetwork } from "../../data/prototypeNetwork";
import { statusColor } from "../../utils/status";

function Row({ k, v }) {
  return (
    <div className="kv">
      <span>{k}</span>
      <b>{v ?? "—"}</b>
    </div>
  );
}

export default function NetworkDetails({ selection, onClose }) {
  if (!selection) {
    return (
      <div className="drawer empty-drawer">
        <p className="kicker">Inspector</p>
        <h3>No asset selected</h3>
        <p className="muted">Click a node, sensor, pipeline, or zone. Search and filters change the view only — coordinates stay locked.</p>
      </div>
    );
  }

  if (selection.kind === "node" || selection.kind === "sensor") {
    const node = selection.data;
    const tel = nodeTelemetry[node.id];
    const isSensor = node.type === "SENSORS";
    return (
      <div className="drawer">
        <header className="drawer-head">
          <div>
            <p className="kicker">{isSensor ? "Sensor" : node.type.replace("_", " ")}</p>
            <h3>{node.name}</h3>
            {node.device_id ? <p className="mono">{node.device_id}</p> : <p className="mono">{node.id}</p>}
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="status-line">
          <i className="pulse" style={{ background: statusColor(node.status) }} />
          {node.status}
        </div>
        <div className="kv-list">
          <Row k="Sensor ID" v={node.id} />
          <Row k="Device ID" v={node.device_id || "Not assigned"} />
          <Row k="Status" v={node.status} />
          <Row k="pH" v={tel?.ph} />
          <Row k="Turbidity" v={tel ? `${tel.turbidity} NTU` : null} />
          <Row k="TDS" v={tel ? `${tel.tds} ppm` : null} />
          <Row k="Temperature" v={tel ? `${tel.temperature}°C` : null} />
          <Row k="Chlorine" v={tel ? `${tel.chlorine} mg/L` : null} />
          <Row k="Pressure" v={tel ? `${tel.pressure} bar` : null} />
        </div>
        <p className="tiny-note">Last updated: {tel?.lastReading ?? "—"}. Demo readings — not extra hardware channels.</p>
        {tel?.trend && (
          <div className="trend-block">
            <span>Trend</span>
            <Sparkline data={tel.trend} width={200} height={40} color={statusColor(node.status)} />
          </div>
        )}
      </div>
    );
  }

  if (selection.kind === "zone") {
    const zone = selection.data;
    const tel = zoneTelemetry[zone.id];
    const feeds = prototypeNetwork.pipelines.filter((p) => p.to === zone.id || p.from === zone.id);
    const incidents = alerts.filter((a) => tel?.incidents?.includes(a.id));
    return (
      <div className="drawer">
        <header className="drawer-head">
          <div>
            <p className="kicker">Zone</p>
            <h3>{zone.name}</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>×</button>
        </header>
        <StatusBadge status={zone.status} />
        <div className="kv-list">
          <Row k="Zone type" v={zone.zoneType} />
          <Row k="Water Quality Index" v={tel?.waterQuality} />
          <Row k="Risk level" v={tel?.risk} />
          <Row k="Connected sensors" v={tel?.sensors === 0 ? "None in topology" : tel?.sensors} />
          <Row k="Connected infrastructure" v={tel?.connectedInfra?.join(" · ")} />
        </div>
        <p className="tiny-note">{tel?.note}</p>
        <p className="tiny-note">Feeders: {feeds.map((p) => p.id).join(", ") || "—"}</p>
        <div className="mini-incidents">
          <p className="kicker">Active incidents</p>
          {incidents.length ? incidents.map((a) => <p key={a.id}>{a.title}</p>) : <p className="muted">None</p>}
        </div>
      </div>
    );
  }

  if (selection.kind === "pipeline") {
    const pipe = selection.data;
    const tel = pipelineTelemetry[pipe.id] || {};
    const related = alerts.filter((a) => a.targetId === pipe.id);
    return (
      <div className="drawer">
        <header className="drawer-head">
          <div>
            <p className="kicker">Pipeline</p>
            <h3>{pipe.id}</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>×</button>
        </header>
        <StatusBadge status={pipe.status} />
        <div className="kv-list">
          <Row k="From" v={pipe.from} />
          <Row k="To" v={pipe.to} />
          <Row k="Status" v={pipe.status} />
          <Row k="Flow" v={tel.flow ? `${tel.flow} L/min` : "Demo"} />
          <Row k="Pressure" v={tel.pressure ? `${tel.pressure} bar` : "Demo"} />
          <Row k="Alerts" v={tel.alerts ?? related.length} />
          <Row k="Last inspection" v={tel.lastInspection} />
        </div>
        {tel.note ? <p className="tiny-note">{tel.note}</p> : null}
      </div>
    );
  }

  return null;
}
