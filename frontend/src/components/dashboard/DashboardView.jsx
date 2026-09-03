import { lazy, Suspense, useState } from "react";
import NetworkMap from "../network/NetworkMap";
import Sparkline, { MiniBars } from "../ui/Sparkline";
import { Icon } from "../ui/Icons";
import {
  dashKpis,
  networkDonut,
  nodeParams,
  performanceUi,
  quickActions,
  recentAlertsUi,
} from "../../data/dashboardUi";

const NetworkMap3D = lazy(() => import("../network/NetworkMap3D"));

function CardShell({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`dash-card ${className}`.trim()}>
      {(title || action) && (
        <header className="dash-card-head">
          <div>
            {title ? <h3>{title}</h3> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

function ViewLink({ children = "View all", onClick }) {
  return (
    <button type="button" className="view-link" onClick={onClick}>
      {children}
    </button>
  );
}

function Donut({ total, healthy, warning, critical }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const sum = healthy + warning + critical || 1;
  const segs = [
    { n: healthy, color: "#35D978" },
    { n: warning, color: "#F5A623" },
    { n: critical, color: "#F0525F" },
  ];
  let offset = 0;
  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 140 140" className="donut-svg" aria-hidden>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        {segs.map((s) => {
          const len = (s.n / sum) * c;
          const el = (
            <circle
              key={s.color}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="donut-center">
        <strong>{total}</strong>
        <span>Total Nodes</span>
      </div>
    </div>
  );
}

function DashboardNetworkCard({ onLocate }) {
  const [mode, setMode] = useState("2d");
  return (
    <CardShell
      title="Network Map"
      subtitle="Live pipeline monitoring"
      className="map-card"
      action={
        <div className="view-toggle dash-map-toggle" role="tablist" aria-label="Map projection">
          <button type="button" className={mode === "3d" ? "on" : ""} onClick={() => setMode("3d")}>
            3D
          </button>
          <button type="button" className={mode === "2d" ? "on" : ""} onClick={() => setMode("2d")}>
            2D
          </button>
        </div>
      }
    >
      <div className="map-embed dash-map-embed">
        {mode === "3d" ? (
          <Suspense fallback={<div className="map-canvas map-3d"><p className="muted" style={{ padding: 16 }}>Loading 3D network…</p></div>}>
            <NetworkMap3D
              onSelect={(sel) => onLocate?.(sel)}
              layers={{ zones: true, sensors: true, infra: true, pipes: true }}
              statusFilter="all"
              flow
              grid
            />
          </Suspense>
        ) : (
          <NetworkMap
            compact
            onSelect={(sel) => onLocate?.(sel)}
          />
        )}
      </div>
    </CardShell>
  );
}

export default function DashboardPage({ onNavigate, onLocate }) {
  const legend = [
    { label: "Healthy", value: networkDonut.healthy, tone: "ok" },
    { label: "Warning", value: networkDonut.warning, tone: "warn" },
    { label: "Critical", value: networkDonut.critical, tone: "crit" },
  ];

  return (
    <div className="dash-v2">
      <section className="kpi-row-v2">
        {dashKpis.map((k) => (
          <article key={k.id} className={`kpi-card-v2 tone-${k.tone}`}>
            <div className="kpi-top">
              <div className={`kpi-icon tone-${k.tone}`}>
                <Icon name={k.icon} size={18} />
              </div>
              <span>{k.label}</span>
            </div>
            <div className="kpi-body">
              <div>
                <div className="kpi-value-v2">
                  <strong>{k.value}</strong>
                  {k.unit ? <span>{k.unit}</span> : null}
                </div>
                <div className={`kpi-delta-v2 ${k.deltaTone}`}>
                  {k.delta ? <em>{k.delta}</em> : null}
                  <span>{k.hint}</span>
                </div>
              </div>
              <div className="kpi-chart">
                {k.chart === "bars" ? (
                  <MiniBars data={k.spark} color="#35D978" width={78} height={36} />
                ) : (
                  <Sparkline
                    data={k.spark}
                    color={k.tone === "crit" ? "#F0525F" : k.tone === "ok" ? "#35D978" : "#8B6CFF"}
                    width={84}
                    height={36}
                    fill
                    strokeWidth={1.8}
                  />
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="dash-grid-v2">
        <div className="dash-col-main">
          <CardShell
            title="Node Status Overview"
            subtitle="2 nodes · Turbidity · TDS · Flow · Temperature"
            action={<ViewLink onClick={() => onNavigate("quality")}>View all</ViewLink>}
          >
            <div className="param-rows">
              {nodeParams.map((p) => (
                <article key={p.id} className="param-row">
                  <div className={`param-icon tone-${p.iconTone}`}>
                    <Icon name={p.icon} size={16} />
                  </div>
                  <div className="param-meta">
                    <strong>{p.label}</strong>
                    <span>{p.statusText}</span>
                  </div>
                  <div className="param-value">
                    <b>{p.value}</b>
                    <em>{p.unit}</em>
                  </div>
                  <Sparkline data={p.spark} color={p.color} width={72} height={28} fill strokeWidth={1.7} />
                  <span className={`status-pill tone-${p.badgeTone}`}>{p.badge}</span>
                </article>
              ))}
            </div>
          </CardShell>

          <div className="dash-mid-row">
            <CardShell
              title="Network Status"
              subtitle="2 nodes · 8 sensors online"
              action={<ViewLink onClick={() => onNavigate("network")}>View more</ViewLink>}
              className="network-status-card"
            >
              <div className="network-status-body">
                <Donut {...networkDonut} />
                <ul className="status-legend">
                  {legend.map((row) => (
                    <li key={row.label}>
                      <i className={`legend-dot ${row.tone}`} />
                      <span>{row.label}</span>
                      <b>{row.value}</b>
                      <Icon name="chevron" size={14} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="wqi-block">
                <div>
                  <span>Sensors online</span>
                  <strong>{networkDonut.sensorsOnline}/8</strong>
                  <em className="tone-ok">All channels</em>
                </div>
                <div className="wqi-bars" aria-hidden>
                  {[40, 55, 48, 62, 70, 66, 72].map((h, i) => (
                    <i key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <button type="button" className="ghost-btn trends-btn" onClick={() => onNavigate("sensors")}>
                  View sensors
                </button>
              </div>
            </CardShell>

            <CardShell
              title="Recent Alerts"
              subtitle="Live updates from the field"
              action={<ViewLink onClick={() => onNavigate("alerts")}>View all</ViewLink>}
            >
              <ul className="recent-alerts">
                {recentAlertsUi.map((a) => (
                  <li key={a.id} className="recent-alert" onClick={() => onNavigate("alerts")}>
                    <div className={`alert-icon tone-${a.tone}`}>
                      <Icon name={a.tone === "blue" ? "flow" : "warning"} size={15} />
                    </div>
                    <div>
                      <strong>{a.title}</strong>
                      <p>{a.subtitle}</p>
                    </div>
                    <time>{a.time}</time>
                  </li>
                ))}
              </ul>
            </CardShell>
          </div>

          <CardShell
            title="System Performance"
            subtitle="Today's performance overview"
            action={<ViewLink onClick={() => onNavigate("reports")}>View report</ViewLink>}
          >
            <div className="perf-grid-v2">
              {performanceUi.map((p) => (
                <article key={p.id} className="perf-tile">
                  <span>{p.label}</span>
                  <strong>{p.value}</strong>
                  <div className={`kpi-delta-v2 ${p.deltaTone}`}>
                    <em>{p.delta}</em>
                    {p.hint ? <span>{p.hint}</span> : null}
                  </div>
                </article>
              ))}
            </div>
            <div className="system-ok">
              <div className="system-ok-icon">
                <Icon name="check" size={22} />
              </div>
              <div>
                <strong>System is operating smoothly</strong>
                <p>All major parameters are within normal range.</p>
              </div>
            </div>
          </CardShell>
        </div>

        <div className="dash-col-side">
          <DashboardNetworkCard onLocate={onLocate} />

          <CardShell title="Quick Actions" subtitle="Frequently used actions">
            <div className="quick-actions">
              {quickActions.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="quick-action"
                  onClick={() => onNavigate(a.page)}
                >
                  <span className="quick-icon">
                    <Icon name={a.icon} size={16} />
                  </span>
                  <span>{a.label}</span>
                  <Icon name="chevron" size={14} />
                </button>
              ))}
            </div>
          </CardShell>
        </div>
      </div>
    </div>
  );
}
