import DashboardView from "../components/dashboard/DashboardView";

export default function DashboardPage({ onNavigate, onLocate }) {
  return <DashboardView onNavigate={onNavigate} onLocate={onLocate} />;
}
