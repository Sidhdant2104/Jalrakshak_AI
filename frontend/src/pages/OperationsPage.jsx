import { useState } from "react";
import Card from "../components/ui/Card";
import { operations } from "../data/dashboardMock";

const ACTIONS = [
  "Dispatch team",
  "Close valve",
  "Isolate pipeline",
  "Increase treatment",
  "Schedule inspection",
  "Resolve",
];

export default function OperationsPage() {
  const [rows, setRows] = useState(operations);
  const [picked, setPicked] = useState(rows[0].id);
  const current = rows.find((r) => r.id === picked);

  const apply = (action) => {
    setRows((list) =>
      list.map((r) => (r.id === picked ? { ...r, action, status: action === "Resolve" ? "CLOSED" : "UPDATED" } : r))
    );
  };

  return (
    <div className="two-col">
      <Card eyebrow="Incidents" title="Active operations">
        <ul className="ops-list">
          {rows.map((r) => (
            <li key={r.id} className={picked === r.id ? "selected" : ""} onClick={() => setPicked(r.id)}>
              <strong>{r.incident}</strong>
              <span>
                {r.action} · {r.status}
              </span>
            </li>
          ))}
        </ul>
      </Card>
      <Card eyebrow={current.id} title={current.incident}>
        <p>
          Owner <b>{current.owner}</b>
        </p>
        <p>
          Current action <b>{current.action}</b>
        </p>
        <div className="action-row wrap">
          {ACTIONS.map((a) => (
            <button key={a} type="button" className="ghost-btn" onClick={() => apply(a)}>
              {a}
            </button>
          ))}
        </div>
        <p className="tiny-note">Actions update this console only. No topology or valve coordinates are invented.</p>
      </Card>
    </div>
  );
}
