import Card from "../components/ui/Card";
import { reports } from "../data/dashboardMock";

export default function ReportsPage() {
  return (
    <div className="card-grid">
      {reports.map((r) => (
        <Card key={r.id} eyebrow={r.id} title={r.title}>
          <p>{r.period}</p>
          <p>{r.summary}</p>
          <span className="pill">{r.status}</span>
        </Card>
      ))}
    </div>
  );
}
