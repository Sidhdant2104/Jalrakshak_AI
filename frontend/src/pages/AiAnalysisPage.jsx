import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import { aiInsight, aiModules, alerts } from "../data/dashboardMock";

export default function AiAnalysisPage({ onLocate }) {
  return (
    <div className="stack">
      <Card className="ai-card" eyebrow="Detected anomaly" title={aiInsight.title}>
        <p className="ai-head">Possible upstream sediment disturbance detected on the Mining Zone feeder.</p>
        <dl className="ai-dl">
          <div><dt>Likely cause</dt><dd>{aiInsight.possibleCause}</dd></div>
          <div><dt>Affected location</dt><dd>{aiInsight.affected}</dd></div>
          <div><dt>Confidence / risk</dt><dd>{aiInsight.confidence} · network risk 61/100</dd></div>
          <div><dt>Recommended action</dt><dd>Inspect intake at J1 and increase filtration at W1. Keep P2 isolation ready.</dd></div>
        </dl>
        <div className="confidence"><i style={{ width: "82%" }} /></div>
        <div className="action-row">
          <button type="button" className="primary-btn" onClick={() => onLocate(alerts[0])}>Locate on map</button>
        </div>
      </Card>
      <div className="module-grid">
        {aiModules.map((m) => (
          <Card key={m.id} title={m.title} action={<StatusBadge status={m.status} />}>
            <div className="score-line"><b>{m.score}</b><span>/ 100</span></div>
            <p>{m.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
