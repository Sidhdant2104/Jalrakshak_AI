import { useState } from "react";
import Card from "../components/ui/Card";

export default function SettingsPage() {
  const [refresh, setRefresh] = useState("15s");
  const [units, setUnits] = useState("Metric");

  return (
    <div className="stack narrow">
      <Card eyebrow="Console" title="Prototype settings">
        <label className="field">
          <span>Auto-refresh</span>
          <select value={refresh} onChange={(e) => setRefresh(e.target.value)}>
            <option>5s</option>
            <option>15s</option>
            <option>1m</option>
            <option>Off</option>
          </select>
        </label>
        <label className="field">
          <span>Units</span>
          <select value={units} onChange={(e) => setUnits(e.target.value)}>
            <option>Metric</option>
            <option>SI display</option>
          </select>
        </label>
        <p className="tiny-note">
          Settings stay in this session. Network coordinates remain exclusively in prototypeNetwork.js.
        </p>
      </Card>
    </div>
  );
}
