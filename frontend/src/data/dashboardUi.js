/** Dashboard UI values aligned to physical scope: 2 nodes · 8 sensors. */

export const PHYSICAL_SCOPE = {
  nodes: 2,
  sensors: 8,
  types: [
    { id: "turbidity", label: "Turbidity", count: 2 },
    { id: "tds", label: "TDS", count: 2 },
    { id: "flow", label: "Flow", count: 2 },
    { id: "temperature", label: "Temperature", count: 2 },
  ],
};

export const dashKpis = [
  {
    id: "alerts",
    label: "Active Alerts",
    value: "3",
    unit: "",
    delta: "↑ 1",
    deltaTone: "crit",
    hint: "vs yesterday",
    icon: "warning",
    tone: "crit",
    spark: [1, 1, 2, 1, 2, 2, 3, 2, 3, 3],
    chart: "line",
  },
  {
    id: "healthy",
    label: "Healthy Nodes",
    value: "100",
    unit: "%",
    delta: "2 / 2",
    deltaTone: "ok",
    hint: "online",
    icon: "shield",
    tone: "ok",
    spark: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    chart: "bars",
  },
  {
    id: "sensors",
    label: "Active Sensors",
    value: "8",
    unit: "online",
    delta: "",
    deltaTone: "violet",
    hint: "Turbidity · TDS · Flow · Temp ×2",
    icon: "sensors",
    tone: "violet",
    spark: [6, 7, 7, 8, 8, 8, 8, 8, 8, 8],
    chart: "line",
  },
];

export const nodeParams = [
  {
    id: "turbidity",
    label: "Turbidity",
    value: "2.1",
    unit: "NTU",
    statusText: "Safe <5 · SN1 / SN2",
    badge: "Normal",
    badgeTone: "ok",
    icon: "droplet",
    iconTone: "blue",
    spark: [1.6, 1.8, 2.0, 1.9, 2.2, 2.1, 2.0, 2.1],
    color: "#35D978",
  },
  {
    id: "tds",
    label: "TDS",
    value: "180",
    unit: "ppm",
    statusText: "Safe <300 · SN1 / SN2",
    badge: "Normal",
    badgeTone: "ok",
    icon: "tds",
    iconTone: "blue",
    spark: [160, 165, 170, 175, 178, 182, 180, 180],
    color: "#35D978",
  },
  {
    id: "flow",
    label: "Flow",
    value: "118",
    unit: "L/min",
    statusText: "Optimal · SN1 / SN2",
    badge: "Optimal",
    badgeTone: "blue",
    icon: "flow",
    iconTone: "violet",
    spark: [110, 114, 120, 118, 116, 119, 118, 118],
    color: "#4EA3FF",
  },
  {
    id: "temp",
    label: "Temperature",
    value: "24.1",
    unit: "°C",
    statusText: "Normal · SN1 / SN2",
    badge: "Normal",
    badgeTone: "blue",
    icon: "thermometer",
    iconTone: "violet",
    spark: [23.4, 23.6, 23.8, 24.0, 24.2, 24.1, 24.0, 24.1],
    color: "#8B6CFF",
  },
];

export const networkDonut = {
  total: 2,
  healthy: 2,
  warning: 0,
  critical: 0,
  sensorsOnline: 8,
  wqi: 86,
  wqiLabel: "Good",
};

export const recentAlertsUi = [
  {
    id: "ra-1",
    title: "High Turbidity",
    subtitle: "SN1 · Turbidity sensor",
    time: "2 min ago",
    tone: "warn",
  },
  {
    id: "ra-2",
    title: "TDS Rising",
    subtitle: "SN2 · TDS sensor",
    time: "10 min ago",
    tone: "warn",
  },
  {
    id: "ra-3",
    title: "Flow Fluctuation",
    subtitle: "SN1 · Flow sensor",
    time: "25 min ago",
    tone: "blue",
  },
];

export const performanceUi = [
  { id: "resp", label: "Avg. Response Time", value: "15 min", delta: "↓ 5 min", deltaTone: "ok", hint: "vs yesterday" },
  { id: "issues", label: "Issues Resolved", value: "18", delta: "↑ 4", deltaTone: "ok", hint: "vs yesterday" },
  { id: "insp", label: "Inspections Done", value: "24", delta: "↑ 6", deltaTone: "ok", hint: "vs yesterday" },
  { id: "uptime", label: "Uptime", value: "99.2%", delta: "Excellent", deltaTone: "ok", hint: "" },
];

export const quickActions = [
  { id: "sensors", label: "View Sensors", icon: "sensors", page: "sensors" },
  { id: "inspect", label: "Schedule Inspection", icon: "calendar", page: "operations" },
  { id: "report", label: "Generate Report", icon: "reports", page: "reports" },
  { id: "alert", label: "Send Alert", icon: "send", page: "alerts" },
];
