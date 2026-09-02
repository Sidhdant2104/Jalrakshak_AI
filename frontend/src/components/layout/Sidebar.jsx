const NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "live", label: "Live Monitoring" },
  { id: "network", label: "Network Map" },
  { id: "quality", label: "Water Quality" },
  { id: "treatment", label: "Treatment & Purification" },
  { id: "analysis", label: "AI Analysis" },
  { id: "alerts", label: "Alerts" },
  { id: "analytics", label: "Analytics" },
  { id: "citizen", label: "Citizen Reports" },
  { id: "operations", label: "Operations" },
  { id: "reports", label: "Reports" },
  { id: "sensors", label: "Sensors" },
  { id: "settings", label: "Settings" },
];

export default function Sidebar({ page, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden />
        <div>
          <p className="brand-kicker">Command Center</p>
          <h1>JALRAKSHAK AI</h1>
        </div>
      </div>
      <nav>
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={page === item.id ? "nav-item active" : "nav-item"}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <span className="live-dot" />
        Prototype loop · ESP-32-001
      </div>
    </aside>
  );
}
