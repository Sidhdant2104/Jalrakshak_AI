import Sidebar from "./Sidebar";

export default function AppShell({ page, onNavigate, children, title, subtitle }) {
  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={onNavigate} />
      <div className="app-main">
        <header className="topbar">
          <div>
            <p className="welcome">Welcome back, Officer</p>
            <h2>{title}</h2>
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </div>
          <div className="topbar-meta">
            <div>
              <span>Shift</span>
              <strong>A · Control</strong>
            </div>
            <div>
              <span>Network</span>
              <strong>Jarakshak-demo-01</strong>
            </div>
            <div className="officer-chip">
              <span className="live-dot" />
              LIVE
            </div>
          </div>
        </header>
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
