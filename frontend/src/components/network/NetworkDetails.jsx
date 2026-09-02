import Card from "../ui/Card";
import Sparkline from "../ui/Sparkline";
import StatusBadge from "../ui/StatusBadge";
import { nodeTelemetry, pipelineTelemetry, zoneTelemetry } from "../../data/dashboardMock";

function Empty() {
  return (
    <div className="empty-panel">
      <p className="eyebrow">Selection</p>
      <h3>Nothing selected</h3>
      <p className="muted">Click a node, pipeline, or zone. Geometry stays locked to prototypeNetwork.js.</p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="detail-metric">
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}

export default function NetworkDetails({ selection }) {
  if (!selection) return <Empty />;

  if (selection.kind === "node") {
    const node = selection.data;
    const tel = nodeTelemetry[node.id];
    return (
      <Card eyebrow="Node" title={node.name}>
        <div className="detail-grid">
          <Metric label="Node ID" value={node.id} />
          <Metric label="Type" value={node.type} />
          <Metric label="Status" value={<StatusBadge status={node.status} />} />
          <Metric label="Device ID" value={node.device_id || "Not assigned"} />
          <Metric label="pH" value={tel?.ph} />
          <Metric label="Turbidity" value={tel ? `${tel.turbidity} NTU` : "—"} />
          <Metric label="TDS" value={tel ? `${tel.tds} mg/L` : "—"} />
          <Metric label="Temperature" value={tel ? `${tel.temperature} °C` : "—"} />
          <Metric label="Pressure" value={tel ? `${tel.pressure} bar` : "—"} />
          <Metric label="Last reading" value={tel?.lastReading} />
        </div>
        {tel?.trend && (
          <div className="trend-block">
            <span>Mini trend (demo)</span>
            <Sparkline data={tel.trend} width={180} height={36} />
          </div>
        )}
        <p className="tiny-note">Readings are dashboard demo values. Positions come only from prototypeNetwork.js.</p>
      </Card>
    );
  }

  if (selection.kind === "zone") {
    const zone = selection.data;
    const tel = zoneTelemetry[zone.id];
    return (
      <Card eyebrow="Zone" title={zone.name}>
        <div className="detail-grid">
          <Metric label="Zone ID" value={zone.id} />
          <Metric label="Zone type" value={zone.zoneType} />
          <Metric label="Status" value={<StatusBadge status={zone.status} />} />
          <Metric label="Water quality" value={tel ? `${tel.waterQuality}` : "—"} />
          <Metric label="Risk level" value={tel?.risk} />
          <Metric label="Sensor count" value={tel?.sensors ?? 0} />
        </div>
        <p className="tiny-note">{tel?.note}</p>
      </Card>
    );
  }

  if (selection.kind === "pipeline") {
    const pipe = selection.data;
    const tel = pipelineTelemetry[pipe.id];
    return (
      <Card eyebrow="Pipeline" title={pipe.id}>
        <div className="detail-grid">
          <Metric label="From" value={pipe.from} />
          <Metric label="To" value={pipe.to} />
          <Metric label="Status" value={<StatusBadge status={pipe.status} />} />
          <Metric label="Flow" value={tel ? `${tel.flow} L/min` : "Demo n/a"} />
          <Metric label="Pressure" value={tel ? `${tel.pressure} bar` : "Demo n/a"} />
        </div>
        {tel?.note ? <p className="tiny-note">{tel.note}</p> : <p className="tiny-note">No extra telemetry in prototype data.</p>}
      </Card>
    );
  }

  if (selection.kind === "valve") {
    const valve = selection.data;
    return (
      <Card eyebrow="Valve" title={valve.name}>
        <div className="detail-grid">
          <Metric label="ID" value={valve.id} />
          <Metric label="State" value={valve.state} />
        </div>
      </Card>
    );
  }

  return <Empty />;
}
