import Card from "../components/ui/Card";
import { citizenReports } from "../data/dashboardMock";

export default function CitizenReportsPage() {
  return (
    <div className="card-grid">
      {citizenReports.map((r) => (
        <Card key={r.id} eyebrow={r.id} title={r.type}>
          <p>
            <b>Location.</b> {r.location}
          </p>
          <p>
            <b>Reported.</b> {r.time}
          </p>
          <p className="ai-corr">
            <b>AI correlation.</b> {r.correlation}
          </p>
          <span className="pill">{r.status}</span>
        </Card>
      ))}
    </div>
  );
}
