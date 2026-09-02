/**
 * FRONTEND PROTOTYPE — demo/dashboard values only.
 * Do not treat these as live sensor telemetry.
 * Network geometry lives exclusively in prototypeNetwork.js.
 */

export const DEMO_DISCLAIMER = "Demo values for SIH prototype — not live backend telemetry";

export const kpis = [
  { id: "wqi", label: "Water Quality Index", value: "86", unit: "/100", delta: "+2.1", tone: "ok", hint: "Composite index (demo)" },
  { id: "safe", label: "Safe Water Sources", value: "02", unit: "online", delta: "Stable", tone: "ok", hint: "W1 · W2" },
  { id: "alerts", label: "Active Alerts", value: "04", unit: "open", delta: "1 contamination", tone: "crit", hint: "Requires officer review" },
  { id: "treatment", label: "Treatment Units Active", value: "01", unit: "plant", delta: "Nominal", tone: "ok", hint: "W1 treatment train" },
  { id: "avg", label: "Average Quality Score", value: "82", unit: "%", delta: "-3.4", tone: "warn", hint: "24h rolling (demo)" },
];

export const qualityParams = [
  { id: "ph", label: "pH", value: 7.4, unit: "", range: "6.5 – 8.5", status: "NORMAL", spark: [7.1, 7.2, 7.3, 7.4, 7.5, 7.4, 7.4] },
  { id: "turbidity", label: "Turbidity", value: 6.8, unit: "NTU", range: "< 5 NTU", status: "WARNING", spark: [2.1, 2.4, 3.8, 4.9, 5.6, 6.2, 6.8] },
  { id: "tds", label: "TDS", value: 412, unit: "mg/L", range: "< 500", status: "NORMAL", spark: [380, 390, 400, 405, 410, 408, 412] },
  { id: "temp", label: "Temperature", value: 24.6, unit: "°C", range: "10 – 30", status: "NORMAL", spark: [23.8, 24.0, 24.2, 24.4, 24.7, 24.6, 24.6] },
  { id: "chlorine", label: "Chlorine", value: 0.18, unit: "mg/L", range: "0.2 – 0.5", status: "WARNING", spark: [0.32, 0.28, 0.24, 0.22, 0.20, 0.19, 0.18] },
  { id: "conductivity", label: "Conductivity", value: 618, unit: "µS/cm", range: "200 – 800", status: "NORMAL", spark: [590, 600, 605, 610, 615, 612, 618] },
  { id: "orp", label: "ORP", value: 248, unit: "mV", range: "200 – 400", status: "NORMAL", spark: [260, 255, 250, 252, 249, 247, 248] },
  { id: "pressure", label: "Pressure", value: 2.1, unit: "bar", range: "2.5 – 4.0", status: "WARNING", spark: [3.2, 3.0, 2.8, 2.6, 2.4, 2.2, 2.1] },
  { id: "flow", label: "Flow", value: 118, unit: "L/min", range: "80 – 160", status: "NORMAL", spark: [110, 114, 120, 118, 116, 119, 118] },
];

export const alerts = [
  {
    id: "AL-1042",
    title: "Possible contamination",
    severity: "CONTAMINATION",
    location: "P2 · J1 → Mining Zone",
    targetId: "P2",
    targetType: "pipeline",
    parameter: "Composite risk",
    value: "0.71",
    range: "< 0.40",
    cause: "Mining Zone feeder P2 is flagged CONTAMINATION in the prototype topology.",
    recommendation: "Inspect J1 outlet toward Mining Zone and keep P2 isolation ready.",
    time: "12 min ago",
    timestamp: "2026-09-02 13:30",
  },
  {
    id: "AL-1041",
    title: "Abnormal pH drift",
    severity: "WARNING",
    location: "SN1",
    targetId: "SN1",
    targetType: "node",
    parameter: "pH",
    value: "7.9",
    range: "6.5 – 8.5",
    cause: "Rising alkalinity after chemical dosing window.",
    recommendation: "Hold coagulant dose and re-sample in 15 minutes.",
    time: "28 min ago",
    timestamp: "2026-09-02 13:14",
  },
  {
    id: "AL-1040",
    title: "Low chlorine residual",
    severity: "WARNING",
    location: "Urban Zone",
    targetId: "Z-URBAN",
    targetType: "zone",
    parameter: "Chlorine",
    value: "0.18 mg/L",
    range: "0.2 – 0.5",
    cause: "Demand spike on P6 into Urban Zone.",
    recommendation: "Increase disinfection stage output at W1.",
    time: "46 min ago",
    timestamp: "2026-09-02 12:56",
  },
  {
    id: "AL-1038",
    title: "High TDS",
    severity: "WARNING",
    location: "Mining Zone",
    targetId: "Z-MINING",
    targetType: "zone",
    parameter: "TDS",
    value: "478 mg/L",
    range: "< 500",
    cause: "Mineral loading typical of mining runoff influence.",
    recommendation: "Keep P2 isolation ready; schedule source inspection.",
    time: "1h 12m ago",
    timestamp: "2026-09-02 12:30",
  },
  {
    id: "AL-1036",
    title: "High turbidity watch",
    severity: "WARNING",
    location: "SN1 corridor",
    targetId: "SN1",
    targetType: "node",
    parameter: "Turbidity",
    value: "6.8 NTU",
    range: "< 5 NTU",
    cause: "Dashboard demo turbidity series is elevated; P3 remains NORMAL on the locked topology.",
    recommendation: "Treat as a quality watch, not a pipeline geometry change.",
    time: "2h ago",
    timestamp: "2026-09-02 11:42",
  },
  {
    id: "AL-1033",
    title: "Pressure drop",
    severity: "WARNING",
    location: "P6 · J2 → Urban Zone",
    targetId: "P6",
    targetType: "pipeline",
    parameter: "Pressure",
    value: "2.1 bar",
    range: "2.5 – 4.0",
    cause: "Demand surge or partial restriction on urban feeder.",
    recommendation: "Verify J2 valve state and urban demand logs.",
    time: "3h ago",
    timestamp: "2026-09-02 10:40",
  },
];

export const aiInsight = {
  title: "Treatment Adjustment Recommended",
  headline: "Contamination flag on the Mining Zone feeder (P2).",
  whatHappened: "P2 (J1 → Mining Zone) is CONTAMINATION in the prototype topology. Urban feeder P6 is WARNING. P3 remains NORMAL.",
  possibleCause: "Mining runoff or ingress on the J1–Mining segment. The sensor corridor (J1 → SN1) is not the contaminated pipeline in this topology.",
  affected: "P2 · Junction 1 · Mining Zone",
  action: "Inspect the affected source path, ready P2 isolation, and increase filtration / disinfection at the treatment plant.",
  confidence: "82%",
  model: "JalRakshak AI · anomaly ensemble (demo)",
};

export const networkStatusMix = [
  { label: "Healthy", value: 72, tone: "ok" },
  { label: "Warning", value: 18, tone: "warn" },
  { label: "Critical", value: 7, tone: "crit" },
  { label: "Offline", value: 3, tone: "off" },
];

export const performance = [
  { label: "Average response time", value: "4.6 min", hint: "Alert to ack (demo)" },
  { label: "Issues resolved", value: "18", hint: "Last 7 days" },
  { label: "Inspections completed", value: "09", hint: "This week" },
  { label: "System uptime", value: "99.4%", hint: "Prototype console" },
];

export const nodeTelemetry = {
  W1: { ph: 7.3, turbidity: 1.8, tds: 290, temperature: 24.1, pressure: 3.4, lastReading: "13:38", trend: [7.2, 7.2, 7.3, 7.3, 7.3] },
  W2: { ph: 7.5, turbidity: 2.4, tds: 310, temperature: 23.8, pressure: 3.1, lastReading: "13:38", trend: [7.4, 7.5, 7.5, 7.5, 7.4] },
  J1: { ph: 7.4, turbidity: 5.1, tds: 360, temperature: 24.4, pressure: 2.9, lastReading: "13:37", trend: [7.3, 7.4, 7.4, 7.5, 7.4] },
  J2: { ph: 7.4, turbidity: 3.2, tds: 340, temperature: 24.2, pressure: 2.3, lastReading: "13:37", trend: [7.4, 7.4, 7.3, 7.4, 7.4] },
  J3: { ph: 7.2, turbidity: 2.0, tds: 305, temperature: 24.0, pressure: 3.0, lastReading: "13:36", trend: [7.2, 7.2, 7.1, 7.2, 7.2] },
  SN1: { ph: 7.4, turbidity: 6.8, tds: 412, temperature: 24.6, pressure: 2.7, lastReading: "13:39", trend: [7.1, 7.2, 7.4, 7.5, 7.4] },
  SN2: { ph: 7.3, turbidity: 2.6, tds: 328, temperature: 24.3, pressure: 2.8, lastReading: "13:39", trend: [7.3, 7.3, 7.2, 7.3, 7.3] },
};

export const zoneTelemetry = {
  "Z-MINING": { waterQuality: 62, risk: "High", sensors: 0, note: "No dedicated zone sensor in topology. P2 into this zone is CONTAMINATION." },
  "Z-URBAN": { waterQuality: 74, risk: "Elevated", sensors: 0, note: "Fed by P6 (WARNING). Chlorine residual below target (demo)." },
  "Z-RURAL": { waterQuality: 88, risk: "Low", sensors: 0, note: "P9 normal. No dedicated zone sensor in topology (demo)." },
};

export const pipelineTelemetry = {
  P2: { flow: 88, pressure: 2.6, note: "Contamination flag on mining feeder" },
  P6: { flow: 142, pressure: 2.1, note: "Urban feeder under warning" },
};

export const analyticsSeries = {
  "24h": {
    labels: ["00", "04", "08", "12", "16", "20", "24"],
    ph: [7.2, 7.3, 7.4, 7.5, 7.4, 7.3, 7.4],
    turbidity: [2.0, 2.2, 3.1, 5.4, 6.2, 6.8, 6.5],
    tds: [300, 310, 330, 370, 400, 412, 408],
    chlorine: [0.34, 0.32, 0.28, 0.24, 0.20, 0.18, 0.19],
    temperature: [23.4, 23.6, 24.0, 24.4, 24.7, 24.6, 24.5],
    pressure: [3.3, 3.2, 3.0, 2.6, 2.3, 2.1, 2.2],
    flow: [102, 108, 120, 130, 124, 118, 116],
    wqi: [90, 89, 86, 82, 80, 79, 81],
  },
  "7d": {
    labels: ["W", "T", "F", "S", "S", "M", "T"],
    ph: [7.3, 7.4, 7.2, 7.5, 7.4, 7.3, 7.4],
    turbidity: [2.4, 2.8, 3.6, 4.1, 5.0, 6.1, 6.8],
    tds: [320, 328, 340, 355, 370, 390, 412],
    chlorine: [0.36, 0.33, 0.30, 0.27, 0.24, 0.20, 0.18],
    temperature: [23.8, 24.0, 24.1, 24.3, 24.4, 24.5, 24.6],
    pressure: [3.4, 3.3, 3.1, 2.9, 2.6, 2.3, 2.1],
    flow: [112, 115, 118, 121, 119, 117, 118],
    wqi: [91, 90, 88, 86, 84, 82, 81],
  },
  "30d": {
    labels: ["W1", "W2", "W3", "W4"],
    ph: [7.3, 7.4, 7.4, 7.4],
    turbidity: [2.6, 3.2, 4.4, 6.8],
    tds: [318, 340, 368, 412],
    chlorine: [0.35, 0.30, 0.24, 0.18],
    temperature: [23.9, 24.1, 24.4, 24.6],
    pressure: [3.3, 3.0, 2.6, 2.1],
    flow: [114, 116, 119, 118],
    wqi: [90, 87, 84, 81],
  },
};

export const treatmentStages = [
  { id: "raw", name: "Raw Water", detail: "Intake from W1 treatment plant header." },
  { id: "pre", name: "Pre-filtration", detail: "Screens coarse sediment before clarification." },
  { id: "sed", name: "Sedimentation", detail: "Settling basin — elevate dwell if turbidity stays high." },
  { id: "chem", name: "Chemical Treatment", detail: "Coagulant / pH correction window." },
  { id: "filt", name: "Filtration", detail: "AI recommends increasing this stage now." },
  { id: "dis", name: "Disinfection", detail: "Chlorine residual currently below urban target." },
  { id: "safe", name: "Safe Water", detail: "Dispatch toward J1 and distribution." },
];

export const aiModules = [
  { id: "anomaly", title: "Anomaly detection", score: 71, status: "WARNING", text: "Mining feeder P2 is outside the expected quality envelope." },
  { id: "contam", title: "Contamination risk", score: 76, status: "CONTAMINATION", text: "P2 (J1 → Mining Zone) carries the contamination status from the locked topology." },
  { id: "leak", title: "Leakage detection", score: 28, status: "NORMAL", text: "No abrupt pressure collapse consistent with a burst main." },
  { id: "trend", title: "Trend analysis", score: 58, status: "WARNING", text: "Urban chlorine residual has declined for 6 consecutive intervals (P6 warning)." },
  { id: "treat", title: "Treatment recommendations", score: 82, status: "WARNING", text: "Increase filtration and verify disinfection residual before peak demand." },
  { id: "risk", title: "Network risk score", score: 61, status: "WARNING", text: "Contamination localized to P2 / Mining Zone; remainder of loop is mostly stable." },
];

export const citizenReports = [
  { id: "CR-219", type: "No water", location: "Rural Zone ward 4", time: "18 min ago", status: "OPEN", correlation: "No matching outage on P9. Likely local service connection (demo)." },
  { id: "CR-218", type: "Bad smell", location: "Urban Zone block C", time: "41 min ago", status: "REVIEW", correlation: "Aligns with low chlorine on P6 urban feeder." },
  { id: "CR-217", type: "Bad taste", location: "Urban Zone block A", time: "1h ago", status: "REVIEW", correlation: "Possible disinfection by-product window; residual is low." },
  { id: "CR-216", type: "Discoloration", location: "Mining Zone edge", time: "2h ago", status: "LINKED", correlation: "Strong correlation with P2 contamination into Mining Zone." },
  { id: "CR-214", type: "Low pressure", location: "Urban Zone tower 2", time: "3h ago", status: "LINKED", correlation: "Matches P6 pressure warning at J2." },
  { id: "CR-211", type: "Suspected contamination", location: "J1 · Mining feeder", time: "4h ago", status: "ESCALATED", correlation: "AI flags P2 as the contamination-risk cluster." },
];

export const operations = [
  { id: "OP-77", incident: "P2 mining contamination", action: "Dispatch team", owner: "Field Unit A", status: "IN PROGRESS" },
  { id: "OP-76", incident: "Urban chlorine low", action: "Increase treatment", owner: "W1 Plant", status: "QUEUED" },
  { id: "OP-74", incident: "P6 pressure warning", action: "Isolate pipeline", owner: "Control Room", status: "STANDBY" },
  { id: "OP-73", incident: "Mining TDS watch", action: "Schedule inspection", owner: "Field Unit B", status: "SCHEDULED" },
  { id: "OP-71", incident: "Rural no-water report", action: "Close valve", owner: "Field Unit C", status: "NOT REQUIRED" },
  { id: "OP-70", incident: "False positive ORP", action: "Resolve", owner: "Analyst", status: "CLOSED" },
];

export const sensorHealth = [
  {
    id: "SN1",
    name: "SENSOR NODE 1",
    deviceId: "ESP-32-001",
    online: true,
    battery: "76%",
    signal: "−61 dBm",
    lastReading: "13:39",
    calibration: "Due in 12 days",
    note: "Same physical ESP setup as SN2.",
  },
  {
    id: "SN2",
    name: "SENSOR NODE 2",
    deviceId: "ESP-32-001",
    online: true,
    battery: "76%",
    signal: "−61 dBm",
    lastReading: "13:39",
    calibration: "Due in 12 days",
    note: "Same physical ESP setup as SN1. Do not invent extra device IDs.",
  },
];

export const reports = [
  { id: "R-09", title: "Daily water quality brief", period: "02 Sep 2026", status: "Ready" },
  { id: "R-08", title: "Network incident log", period: "Last 7 days", status: "Ready" },
  { id: "R-07", title: "Treatment plant performance", period: "August 2026", status: "Draft" },
  { id: "R-06", title: "Citizen complaint correlation", period: "Last 30 days", status: "Ready" },
];
