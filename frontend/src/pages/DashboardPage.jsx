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

const LEGEND = [
  ["Healthy", "ok"],
  ["Warning", "warn"],
  ["Critical", "crit"],
  ["Contamination", "contam"],
  ["Offline", "off"],
];

export default function DashboardPage({ onNavigate, onSelect }) {
  return (
    <div className="dash">
      <p className="demo-banner">{DEMO_DISCLAIMER}</p>

      <div className="kpi-row">
        {kpis.map((k) => (
          <article key={k.id} className={`kpi-card tone-${k.tone}`}>
            <p className="kpi-label">{k.label}</p>
            <div className="kpi-value">
              <strong>{k.value}</strong>
              <span>{k.unit}</span>
            </div>
            <p className="kpi-delta">{k.delta}</p>
            <p className="tiny-note">{k.hint}</p>
          </article>
        ))}
      </div>

      <div className="dash-main">
        <Card
          className="map-card"
          eyebrow="Live network map"
          title="Prototype topology"
          action={
            <button type="button" className="ghost-btn" onClick={() => onNavigate("network")}>
              Open full map
            </button>
          }
        >
          <div className="map-legend-row tight">
            {LEGEND.map(([label, tone]) => (
              <span key={label} className="legend-item">
                <i className={`legend-dot ${tone}`} />
                {label}
              </span>
            ))}
          </div>
          <div className="map-embed">
            <NetworkMap
              compact
              selectedId={null}
              onSelect={(sel) => {
                onSelect(sel);
                onNavigate("network");
              }}
            />
          </div>
        </Card>

        <div className="dash-col">
          <Card eyebrow="JalRakshak AI" title={aiInsight.title} className="ai-card">
            <p className="ai-head">{aiInsight.headline}</p>
            <dl className="ai-dl">
              <div>
                <dt>What happened</dt>
                <dd>{aiInsight.whatHappened}</dd>
              </div>
              <div>
                <dt>Possible cause</dt>
                <dd>{aiInsight.possibleCause}</dd>
              </div>
              <div>
                <dt>Affected location</dt>
                <dd>{aiInsight.affected}</dd>
              </div>
              <div>
                <dt>Recommended action</dt>
                <dd>{aiInsight.action}</dd>
              </div>
            </dl>
            <div className="ai-meta">
              <span>Confidence {aiInsight.confidence}</span>
              <span>{aiInsight.model}</span>
            </div>
          </Card>

          <Card eyebrow="Active alerts" title="Priority queue">
            <ul className="alert-list">
              {alerts.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <span className={`sev sev-${a.severity.toLowerCase()}`} />
                  <div>
                    <strong>{a.title}</strong>
                    <p>
                      {a.location} · {a.time}
                    </p>
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
              <strong>
                {p.value}
                <em>{p.unit}</em>
              </strong>
              <p>Normal {p.range}</p>
              <Sparkline data={p.spark} color={statusColor(p.status)} />
              <span className="tiny-note">Dashboard demo series</span>
            </article>
          ))}
        </div>
      </Card>

      <div className="dash-bottom">
        <Card eyebrow="Network status" title="Health mix">
          {networkStatusMix.map((row) => (
            <div key={row.label} className="mix-row">
              <span>
                <i className={`legend-dot ${row.tone}`} />
                {row.label}
              </span>
              <div className="mix-bar">
                <i className={row.tone} style={{ width: `${row.value}%` }} />
              </div>
              <b>{row.value}%</b>
            </div>
          ))}
        </Card>

        <Card eyebrow="Recent alerts" title="Incident timeline">
          <ol className="timeline">
            {alerts.map((a) => (
              <li key={a.id}>
                <span className="time">{a.time}</span>
                <span>
                  {a.title} · {a.location}
                </span>
              </li>
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
