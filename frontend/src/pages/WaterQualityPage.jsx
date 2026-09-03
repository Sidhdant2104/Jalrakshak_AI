import Card from "../components/ui/Card";
import Sparkline from "../components/ui/Sparkline";
import StatusBadge from "../components/ui/StatusBadge";
import { qualityParams } from "../data/dashboardMock";
import { statusColor } from "../utils/status";

export default function WaterQualityPage() {
  return (
    <div className="param-grid lg">
      {qualityParams.map((p) => (
        <Card key={p.id} eyebrow="Parameter" title={p.label}>
          <div className="quality-hero">
            <strong>{p.value}<em>{p.unit}</em></strong>
            <StatusBadge status={p.status} />
          </div>
          <p className="muted">Normal range {p.range}</p>
          <Sparkline data={p.spark} width={220} height={42} color={statusColor(p.status)} />
          <p className="tiny-note">Dashboard demo series. Not claimed as a dedicated extra sensor channel.</p>
        </Card>
      ))}
    </div>
  );
}
