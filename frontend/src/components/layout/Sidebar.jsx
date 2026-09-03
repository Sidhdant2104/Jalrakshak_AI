import { Icon } from "../ui/Icons";
import { alerts } from "../../data/dashboardMock";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "live", label: "Live Monitoring", icon: "live" },
  { id: "network", label: "Network Map", icon: "network" },
  { id: "quality", label: "Water Quality", icon: "quality" },
  { id: "treatment", label: "Treatment & Purification", icon: "treatment" },
  { id: "analysis", label: "AI Analysis", icon: "analysis" },
  { id: "alerts", label: "Alerts", icon: "alerts" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
  { id: "citizen", label: "Citizen Reports", icon: "citizen" },
  { id: "operations", label: "Operations", icon: "operations", badge: 3 },
  { id: "reports", label: "Reports", icon: "reports" },
  { id: "sensors", label: "Sensors", icon: "sensors" },
  { id: "settings", label: "Settings", icon: "settings" },
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
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.id === "alerts" ? <em className="nav-badge">{alerts.length}</em> : item.badge ? <em className="nav-badge">{item.badge}</em> : null}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <span className="live-dot" />
        Loop live · ESP-32-001
      </div>
    </aside>
  );
}
