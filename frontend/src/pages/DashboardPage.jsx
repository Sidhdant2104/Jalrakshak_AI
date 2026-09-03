import Card from "../components/ui/Card";
import Sparkline from "../components/ui/Sparkline";
import StatusBadge from "../components/ui/StatusBadge";
import NetworkMap from "../components/network/NetworkMap";
import {
  aiInsight,
  alerts,
  DEMO_DISCLAIMER,
  kpis,
  networkStatusMix,
  performance,
  qualityParams,
} from "../data/dashboardMock";
import { statusColor } from "../utils/status";

export default function DashboardPage({ onNavigate, onLocate }) {
  const primary = alerts[0];
  return (
    <div className="dash">
      <p className="demo-banner">{DEMO_DISCLAIMER}</p>
      <section className="sit-bar">
        <div>
          <p className="kicker">What</p>
          <h3>{aiInsight.headline}</h3>
        </div>
        <div>
          <p className="kicker">Where</p>
          <p>{aiInsight.affected}</p>
        </div>
        <div>
          <p className="kicker">How serious</p>
          <p>Contamination · confidence {aiInsight.confidence}</p>
        </div>
        <div>
          <p className="kicker">What should be done</p>
          <p>{aiInsight.action}</p>
        </div>
        <button type="button" className="primary-btn" onClick={() => onLocate(primary)}>
          Locate on map
        </button>
      </section>

      <div className="kpi-row">
        {kpis.map((k) => (
          <article key={k.id} className={`kpi-card tone-${k.tone}`}>
            <p className="kpi-label">{k.label}</p>
            <div className="kpi-value">
              <strong>{k.value}</strong>
              <span>{k.unit}</span>
            </div>
            <p className="kpi-delta">{k.delta}</p>
          </article>
        ))}
      </div>

      <div className="dash-main">
        <Card
          eyebrow="Network"
          title="Live schematic"
          action={
            <button type="button" className="ghost-btn" onClick={() => onNavigate("network")}>
              Expand map
            </button>
          }
        >
          <div className="map-embed">
            <NetworkMap
              compact
              onSelect={(sel) => onLocate(sel)}
            />
          </div>
        </Card>
        <div className="dash-col">
          <Card className="ai-card" eyebrow="JalRakshak AI" title={aiInsight.title}>
            <p className="ai-head">Possible upstream sediment / mining ingress on P2.</p>
            <dl className="ai-dl">
              <div><dt>Likely cause</dt><dd>{aiInsight.possibleCause}</dd></div>
              <div><dt>Recommended action</dt><dd>Inspect intake path at J1 and increase filtration at W1.</dd></div>
            </dl>
            <div className="confidence" aria-hidden><i style={{ width: aiInsight.confidence }} /></div>
            <div className="ai-meta">
              <span>Confidence {aiInsight.confidence}</span>
              <span>{aiInsight.model}</span>
            </div>
          </Card>
          <Card eyebrow="Active alerts" title="Priority">
            <ul className="alert-list">
              {alerts.slice(0, 4).map((a) => (
                <li key={a.id} onClick={() => onLocate(a)}>
                  <span className={`sev sev-${a.severity.toLowerCase()}`} />
                  <div>
                    <strong>{a.title}</strong>
                    <p>{a.location} · {a.time}</p>
                  </div>
                  <StatusBadge status={a.severity} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card eyebrow="Water quality overview" title="Key parameters">
        <div className="param-grid">
          {qualityParams.map((p) => (
            <article key={p.id} className="param-card">
              <header>
                <span>{p.label}</span>
                <StatusBadge status={p.status} />
              </header>
              <strong>{p.value}<em>{p.unit}</em></strong>
              <p>Normal {p.range}</p>
              <Sparkline data={p.spark} color={statusColor(p.status)} />
            </article>
          ))}
        </div>
      </Card>

      <div className="dash-bottom">
        <Card eyebrow="Network health" title="Status mix">
          {networkStatusMix.map((row) => (
            <div key={row.label} className="mix-row">
              <span><i className={`legend-dot ${row.tone}`} />{row.label}</span>
              <div className="mix-bar"><i className={row.tone} style={{ width: `${row.value}%` }} /></div>
              <b>{row.value}%</b>
            </div>
          ))}
        </Card>
        <Card eyebrow="Recent incidents" title="Timeline">
          <ol className="timeline">
            {alerts.map((a) => (
              <li key={a.id}><span className="time">{a.time}</span><span>{a.title} · {a.location}</span></li>
            ))}
          </ol>
        </Card>
        <Card eyebrow="System performance" title="Control room">
          <div className="perf-grid">
            {performance.map((p) => (
              <article key={p.label}>
                <p>{p.label}</p>
                <strong>{p.value}</strong>
                <span>{p.hint}</span>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
