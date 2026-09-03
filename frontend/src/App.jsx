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
  dashboard: ["Situation overview", "What is happening · where · severity · action"],
  live: ["Live monitoring", "SN1 / SN2 streaming — 8 physical sensor channels"],
  network: ["Network map", "Schematic GIS — coordinates from prototypeNetwork.js"],
  quality: ["Water quality", "Turbidity · TDS · Flow · Temperature from SN1 / SN2"],
  treatment: ["Treatment & purification", "W1 process train"],
  analysis: ["AI analysis", "Anomaly, cause, location, recommended action"],
  alerts: ["Incident center", "Severity, evidence, and response"],
  analytics: ["Analytics", "Trends for the 4 physical sensor types"],
  citizen: ["Citizen reports", "Complaints correlated to network assets"],
  operations: ["Operations", "Incidents and control actions"],
  reports: ["Reports", "Quality, treatment, incidents, sensors, zones"],
  sensors: ["Sensors", "2 nodes · 8 sensors — Turbidity · TDS · Flow · Temp ×2"],
  settings: ["Settings", "Session preferences"],
};

function resolveTarget(alert) {
  const nodes = prototypeNetwork.nodes;
  const pipes = prototypeNetwork.pipelines;
  if (alert.targetType === "pipeline") {
    const data = pipes.find((p) => p.id === alert.targetId);
    return data ? { kind: "pipeline", id: data.id, data } : null;
  }
  const data = nodes.find((n) => n.id === alert.targetId);
  if (!data) return null;
  const kind = data.type === "ZONE" ? "zone" : data.type === "SENSORS" ? "sensor" : "node";
  return { kind, id: data.id, data };
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selection, setSelection] = useState(null);
  const [focusToken, setFocusToken] = useState(0);

  const locate = (alertOrSel) => {
    const sel = alertOrSel?.targetId ? resolveTarget(alertOrSel) : alertOrSel;
    setSelection(sel);
    setFocusToken((n) => n + 1);
    setPage("network");
  };

  const [title, subtitle] = TITLES[page];

  return (
    <AppShell page={page} onNavigate={setPage} title={title} subtitle={subtitle}>
      {page === "dashboard" && <DashboardPage onNavigate={setPage} onLocate={locate} />}
      {page === "live" && <LiveMonitoringPage onLocate={locate} />}
      {page === "network" && <NetworkPage selection={selection} onSelect={setSelection} focusToken={focusToken} />}
      {page === "quality" && <WaterQualityPage />}
      {page === "treatment" && <TreatmentPage />}
      {page === "analysis" && <AiAnalysisPage onLocate={locate} />}
      {page === "alerts" && <AlertsPage onLocate={locate} />}
      {page === "analytics" && <AnalyticsPage />}
      {page === "citizen" && <CitizenReportsPage onLocate={locate} />}
      {page === "operations" && <OperationsPage />}
      {page === "reports" && <ReportsPage />}
      {page === "sensors" && <SensorsPage onLocate={locate} />}
      {page === "settings" && <SettingsPage />}
    </AppShell>
  );
}
