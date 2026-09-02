import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import { aiInsight, aiModules } from "../data/dashboardMock";

export default function AiAnalysisPage() {
  return (
    <div className="stack">
      <Card className="ai-card" eyebrow="Primary recommendation" title={aiInsight.title}>
        <p className="ai-head">{aiInsight.headline}</p>
        <p>{aiInsight.action}</p>
        <div className="ai-meta">
          <span>Risk score 61 / 100</span>
          <span>{aiInsight.model}</span>
        </div>
      </Card>
      <div className="module-grid">
        {aiModules.map((m) => (
          <Card key={m.id} title={m.title} action={<StatusBadge status={m.status} />}>
            <div className="score-line">
              <b>{m.score}</b>
              <span>/ 100</span>
            </div>
            <p>{m.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
