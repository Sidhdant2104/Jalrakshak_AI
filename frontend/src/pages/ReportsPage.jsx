import Card from "../components/ui/Card";
import { reports } from "../data/dashboardMock";

export default function ReportsPage() {
  return (
    <div className="card-grid">
      {reports.map((r) => (
        <Card key={r.id} eyebrow={r.id} title={r.title}>
          <p>{r.period}</p>
          <span className="pill">{r.status}</span>
          <p className="tiny-note">Export is a prototype placeholder.</p>
        </Card>
      ))}
    </div>
  );
}
