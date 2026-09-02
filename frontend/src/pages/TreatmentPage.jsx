import { useState } from "react";
import Card from "../components/ui/Card";
import { treatmentStages } from "../data/dashboardMock";

export default function TreatmentPage() {
  const [active, setActive] = useState("filt");
  const stage = treatmentStages.find((s) => s.id === active);

  return (
    <div className="stack">
      <div className="pipe-flow">
        {treatmentStages.map((s, i) => (
          <div key={s.id} className="pipe-col">
            <button
              type="button"
              className={s.id === active ? "stage-card active" : "stage-card"}
              onClick={() => setActive(s.id)}
            >
              <span>0{i + 1}</span>
              <strong>{s.name}</strong>
            </button>
            {i < treatmentStages.length - 1 ? <div className="pipe-arrow">↓</div> : null}
          </div>
        ))}
      </div>
      <Card eyebrow="Stage detail" title={stage.name}>
        <p>{stage.detail}</p>
        <p className="tiny-note">Visual treatment train for the W1 plant. Not a second network map.</p>
      </Card>
    </div>
  );
}
