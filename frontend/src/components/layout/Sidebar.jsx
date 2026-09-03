import { useEffect } from "react";
import { Icon } from "../ui/Icons";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "live", label: "Monitoring", icon: "monitoring", liveDot: true },
  { id: "alerts", label: "Alerts", icon: "alerts", badge: 3 },
  { id: "network", label: "Network Map", icon: "network" },
  { id: "reports", label: "Reports", icon: "reports" },
  { id: "analysis", label: "Analysis", icon: "analysis" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function Sidebar({
  page,
  onNavigate,
  theme = "dark",
  onThemeChange,
  mobileOpen = false,
  onCloseMobile,
}) {
  const go = (id) => {
    onNavigate(id);
    onCloseMobile?.();
  };

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseMobile?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      <div
        className={`sidebar-backdrop${mobileOpen ? " open" : ""}`}
        onClick={onCloseMobile}
        aria-hidden={!mobileOpen}
      />
      <aside className={`sidebar${mobileOpen ? " open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-mobile-head">
          <span>Navigation</span>
          <button type="button" className="icon-action" aria-label="Close menu" onClick={onCloseMobile}>
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="brand">
          <img className="brand-logo" src="/logo-ui.png?v=3" alt="JalRakshak AI" />
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {NAV.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={active ? "nav-item active" : "nav-item"}
                onClick={() => go(item.id)}
              >
                <span className="nav-icon">
                  <Icon name={item.icon} size={17} />
                </span>
                <span className="nav-label">{item.label}</span>
                {item.liveDot ? <i className="nav-live-dot" aria-label="Live" /> : null}
                {item.badge ? <em className="nav-badge">{item.badge}</em> : null}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <button type="button" className="user-card" onClick={() => go("settings")}>
            <div className="user-avatar">
              <span>AS</span>
              <i className="user-online" />
            </div>
            <div className="user-meta">
              <strong>Arjun Singh</strong>
              <span>Water Officer</span>
            </div>
            <Icon name="chevronDown" size={14} />
          </button>

          <div className="theme-toggle" role="group" aria-label="Theme">
            <button
              type="button"
              className={theme === "light" ? "on" : ""}
              onClick={() => onThemeChange?.("light")}
            >
              <Icon name="sun" size={13} />
              Light
            </button>
            <button
              type="button"
              className={theme === "dark" ? "on" : ""}
              onClick={() => onThemeChange?.("dark")}
            >
              <Icon name="moon" size={13} />
              Dark
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
