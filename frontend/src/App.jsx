import { useState } from "react";
import AppShell from "./components/layout/AppShell";
import NetworkPage from "./components/network/NetworkPage";
import DashboardPage from "./pages/DashboardPage";
import LiveMonitoringPage from "./pages/LiveMonitoringPage";
import WaterQualityPage from "./pages/WaterQualityPage";
import TreatmentPage from "./pages/TreatmentPage";
import AiAnalysisPage from "./pages/AiAnalysisPage";
import AlertsPage from "./pages/AlertsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CitizenReportsPage from "./pages/CitizenReportsPage";
import OperationsPage from "./pages/OperationsPage";
import ReportsPage from "./pages/ReportsPage";
import SensorsPage from "./pages/SensorsPage";
import SettingsPage from "./pages/SettingsPage";
import { prototypeNetwork } from "./data/prototypeNetwork";

const TITLES = {
  dashboard: ["Command dashboard", "Real-time water network intelligence"],
  live: ["Live monitoring", "Streaming view of the locked prototype loop"],
  network: ["Network map", "Exact coordinates from prototypeNetwork.js"],
  quality: ["Water quality", "Parameter cards with demo ranges and status"],
  treatment: ["Treatment & purification", "W1 process train"],
  analysis: ["AI analysis", "Anomaly, contamination, leakage, and risk"],
  alerts: ["Alerts", "Severity, location, and recommended action"],
  analytics: ["Analytics", "24h · 7 days · 30 days · custom"],
  citizen: ["Citizen reports", "Complaints with AI correlation"],
  operations: ["Operations", "Incidents and control actions"],
  reports: ["Reports", "Briefs for the control room"],
  sensors: ["Sensors", "SN1 and SN2 share ESP-32-001"],
  settings: ["Settings", "Session preferences for this prototype"],
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selection, setSelection] = useState(null);

  const locateAlert = (alert) => {
    const nodes = prototypeNetwork.nodes;
    const pipes = prototypeNetwork.pipelines;
    if (alert.targetType === "pipeline") {
      const data = pipes.find((p) => p.id === alert.targetId);
      setSelection(data ? { kind: "pipeline", id: data.id, data } : null);
    } else if (alert.targetType === "zone") {
      const data = nodes.find((n) => n.id === alert.targetId);
      setSelection(data ? { kind: "zone", id: data.id, data } : null);
    } else {
      const data = nodes.find((n) => n.id === alert.targetId);
      setSelection(data ? { kind: "node", id: data.id, data } : null);
    }
    setPage("network");
  };

  const [title, subtitle] = TITLES[page];

  return (
    <AppShell page={page} onNavigate={setPage} title={title} subtitle={subtitle}>
      {page === "dashboard" && <DashboardPage onNavigate={setPage} onSelect={setSelection} />}
      {page === "live" && <LiveMonitoringPage onNavigate={setPage} onSelect={setSelection} />}
      {page === "network" && <NetworkPage selection={selection} onSelect={setSelection} />}
      {page === "quality" && <WaterQualityPage />}
      {page === "treatment" && <TreatmentPage />}
      {page === "analysis" && <AiAnalysisPage />}
      {page === "alerts" && <AlertsPage onLocate={locateAlert} />}
      {page === "analytics" && <AnalyticsPage />}
      {page === "citizen" && <CitizenReportsPage />}
      {page === "operations" && <OperationsPage />}
      {page === "reports" && <ReportsPage />}
      {page === "sensors" && <SensorsPage />}
      {page === "settings" && <SettingsPage />}
    </AppShell>
  );
}
