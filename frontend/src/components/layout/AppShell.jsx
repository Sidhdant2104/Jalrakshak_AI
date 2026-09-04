import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Icon } from "../ui/Icons";
import ThemeToggle from "../ui/ThemeToggle";
import { useTheme } from "../../hooks/useTheme";

export default function AppShell({ page, onNavigate, children, title, subtitle }) {
  const [theme] = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDashboard = page === "dashboard";

  useEffect(() => {
    setMobileOpen(false);
  }, [page]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className={`app-shell theme-${theme}${mobileOpen ? " nav-open" : ""}`}>
      <Sidebar
        page={page}
        onNavigate={onNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="app-main">
        <div className="mobile-bar">
          <button
            type="button"
            className="icon-action"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="menu" size={18} />
          </button>
          <div className="mobile-bar-brand">
            <img src="/logo-mark.png?v=3" alt="JalRakshak AI" />
            <strong>JalRakshak AI</strong>
          </div>
          <ThemeToggle compact />
          <button type="button" className="report-btn report-btn-compact" onClick={() => onNavigate("alerts")}>
            <Icon name="plus" size={15} />
            <span className="report-label">Report</span>
          </button>
        </div>

        {isDashboard ? (
          <header className="topbar topbar-dash">
            <div className="topbar-copy">
              <h2>Welcome back, Officer!</h2>
              <p className="muted">Here&apos;s your real-time water network overview</p>
            </div>
            <div className="topbar-actions">
              <ThemeToggle compact />
              <button type="button" className="icon-action" aria-label="Notifications">
                <Icon name="bell" size={16} />
                <i className="notif-dot" />
              </button>
              <button type="button" className="icon-action" aria-label="Search">
                <Icon name="search" size={16} />
              </button>
              <button
                type="button"
                className="icon-action"
                aria-label="Preferences"
                onClick={() => onNavigate("settings")}
              >
                <Icon name="sliders" size={16} />
              </button>
              <button type="button" className="report-btn" onClick={() => onNavigate("alerts")}>
                <Icon name="plus" size={15} />
                <span className="report-label">Report Incident</span>
              </button>
            </div>
          </header>
        ) : (
          <header className="topbar">
            <div className="topbar-copy">
              <p className="welcome">Welcome back, Officer</p>
              <h2>{title}</h2>
              {subtitle ? <p className="muted">{subtitle}</p> : null}
            </div>
            <div className="topbar-actions">
              <ThemeToggle compact />
              <button type="button" className="icon-action" aria-label="Notifications">
                <Icon name="bell" size={16} />
              </button>
              <button type="button" className="report-btn" onClick={() => onNavigate("alerts")}>
                <Icon name="plus" size={15} />
                <span className="report-label">Report Incident</span>
              </button>
            </div>
          </header>
        )}
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
