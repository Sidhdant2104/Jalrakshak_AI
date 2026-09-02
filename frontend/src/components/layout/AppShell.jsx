import Sidebar from "./Sidebar";

export default function AppShell({ page, onNavigate, children, title, subtitle, actions }) {
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
          <div className="topbar-actions">
            {actions}
            <div className="officer-chip">
              <span className="live-dot" />
              Ops · Demo
            </div>
          </div>
        </header>
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
