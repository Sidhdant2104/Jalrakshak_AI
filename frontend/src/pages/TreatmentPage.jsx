import { useState } from "react";
import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import { treatmentStages } from "../data/dashboardMock";

export default function TreatmentPage() {
  const [active, setActive] = useState("filt");
  const stage = treatmentStages.find((s) => s.id === active);
  return (
    <div className="two-col">
      <div className="pipe-flow">
        {treatmentStages.map((s, i) => (
          <div key={s.id} className="pipe-col">
            <button type="button" className={s.id === active ? "stage-card active" : "stage-card"} onClick={() => setActive(s.id)}>
              <span className="mono">0{i + 1}</span>
              <strong>{s.name}</strong>
              <StatusBadge status={s.status} />
            </button>
            {i < treatmentStages.length - 1 ? <div className="pipe-arrow">↓</div> : null}
          </div>
        ))}
      </div>
      <Card eyebrow="Stage" title={stage.name}>
        <StatusBadge status={stage.status} />
        <p>{stage.detail}</p>
        <div className="kv-list">
          <div className="kv"><span>Quality before</span><b>{stage.before}</b></div>
          <div className="kv"><span>Quality after</span><b>{stage.after}</b></div>
          <div className="kv"><span>Reading</span><b>{stage.reading}</b></div>
        </div>
        <p className="tiny-note">W1 plant train (demo). Not a second network map.</p>
      </Card>
    </div>
  );
}
