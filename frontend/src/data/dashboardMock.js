/**
 * FRONTEND PROTOTYPE — demo/dashboard values only.
 * Do not treat these as live sensor telemetry.
 * Network geometry lives exclusively in prototypeNetwork.js.
 */

export const DEMO_DISCLAIMER = "Demo values for SIH prototype — not live backend telemetry";

export const kpis = [
  { id: "nodes", label: "Sensor Nodes", value: "02", unit: "online", delta: "SN1 · SN2", tone: "ok", hint: "Physical nodes" },
  { id: "sensors", label: "Active Sensors", value: "08", unit: "channels", delta: "4 types × 2", tone: "ok", hint: "Turbidity · TDS · Flow · Temp" },
  { id: "alerts", label: "Active Alerts", value: "03", unit: "open", delta: "Sensor watches", tone: "warn", hint: "Requires officer review" },
  { id: "wqi", label: "Water Quality Index", value: "86", unit: "/100", delta: "+2.1", tone: "ok", hint: "Composite index (demo)" },
  { id: "avg", label: "Sensors Online", value: "100", unit: "%", delta: "8 / 8", tone: "ok", hint: "Both nodes reporting" },
];

/** Physical sensor channels only: Turbidity×2, TDS×2, Flow×2, Temperature×2 (values are node averages). */
export const qualityParams = [
  { id: "turbidity", label: "Turbidity", value: 2.1, unit: "NTU", range: "< 5 NTU", status: "NORMAL", spark: [1.6, 1.8, 2.0, 1.9, 2.2, 2.1, 2.0], sensors: ["SN1-TURB", "SN2-TURB"] },
  { id: "tds", label: "TDS", value: 180, unit: "ppm", range: "< 300 ppm", status: "NORMAL", spark: [160, 165, 170, 175, 178, 182, 180], sensors: ["SN1-TDS", "SN2-TDS"] },
  { id: "flow", label: "Flow", value: 118, unit: "L/min", range: "80 – 160", status: "NORMAL", spark: [110, 114, 120, 118, 116, 119, 118], sensors: ["SN1-FLOW", "SN2-FLOW"] },
  { id: "temp", label: "Temperature", value: 24.1, unit: "°C", range: "10 – 30", status: "NORMAL", spark: [23.4, 23.6, 23.8, 24.0, 24.2, 24.1, 24.0], sensors: ["SN1-TEMP", "SN2-TEMP"] },
];

export const alerts = [
  {
    id: "AL-1042",
    title: "High turbidity watch",
    severity: "WARNING",
    location: "SN1 · Turbidity",
    targetId: "SN1",
    targetType: "node",
    parameter: "Turbidity",
    value: "4.8 NTU",
    range: "< 5 NTU",
    cause: "SN1 turbidity channel trending toward the safe limit (demo).",
    recommendation: "Compare SN1 and SN2 turbidity sensors and inspect upstream of the SN1 corridor.",
    time: "12 min ago",
    timestamp: "2026-09-02 13:30",
  },
  {
    id: "AL-1041",
    title: "TDS rising",
    severity: "WARNING",
    location: "SN2 · TDS",
    targetId: "SN2",
    targetType: "node",
    parameter: "TDS",
    value: "268 ppm",
    range: "< 300 ppm",
    cause: "SN2 TDS sensor elevated relative to SN1 baseline (demo).",
    recommendation: "Validate SN2 TDS calibration and resample within 15 minutes.",
    time: "28 min ago",
    timestamp: "2026-09-02 13:14",
  },
  {
    id: "AL-1038",
    title: "Flow fluctuation",
    severity: "WARNING",
    location: "SN1 · Flow",
    targetId: "SN1",
    targetType: "node",
    parameter: "Flow",
    value: "142 L/min",
    range: "80 – 160",
    cause: "Short-lived flow spike on SN1 flow sensor (demo).",
    recommendation: "Cross-check SN2 flow and confirm no isolation valve movement on the loop.",
    time: "46 min ago",
    timestamp: "2026-09-02 12:56",
  },
  {
    id: "AL-1036",
    title: "Temperature drift",
    severity: "WARNING",
    location: "SN2 · Temperature",
    targetId: "SN2",
    targetType: "node",
    parameter: "Temperature",
    value: "27.4 °C",
    range: "10 – 30",
    cause: "SN2 temperature channel warmer than SN1 (demo).",
    recommendation: "Confirm probe seating on SN2 temperature sensor.",
    time: "2h ago",
    timestamp: "2026-09-02 11:42",
  },
];

export const aiInsight = {
  title: "Sensor Watch Recommended",
  headline: "SN1 turbidity and SN2 TDS channels need officer review.",
  whatHappened: "Physical scope is 2 nodes (SN1, SN2) with 8 sensors: Turbidity×2, TDS×2, Flow×2, Temperature×2.",
  possibleCause: "Localized water-quality drift on the SN1 / SN2 corridor (demo).",
  affected: "SN1 Turbidity · SN2 TDS",
  action: "Compare paired sensors on both nodes, verify calibration, and locate the node on the locked network map if needed.",
  confidence: "78%",
  model: "JalRakshak AI · anomaly ensemble (demo)",
};

export const networkStatusMix = [
  { label: "Healthy", value: 100, tone: "ok" },
  { label: "Warning", value: 0, tone: "warn" },
  { label: "Critical", value: 0, tone: "crit" },
  { label: "Offline", value: 0, tone: "off" },
];

export const performance = [
  { label: "Average response time", value: "4.6 min", hint: "Alert to ack (demo)" },
  { label: "Issues resolved", value: "18", hint: "Last 7 days" },
  { label: "Inspections completed", value: "09", hint: "This week" },
  { label: "System uptime", value: "99.4%", hint: "Prototype console" },
];

export const nodeTelemetry = {
  W1: { ph: 7.3, turbidity: 1.8, tds: 290, temperature: 24.1, chlorine: 0.46, pressure: 3.4, lastReading: "4 sec ago", trend: [7.2, 7.2, 7.3, 7.3, 7.3] },
  W2: { ph: 7.5, turbidity: 2.4, tds: 310, temperature: 23.8, chlorine: 0.38, pressure: 3.1, lastReading: "4 sec ago", trend: [7.4, 7.5, 7.5, 7.5, 7.4] },
  J1: { ph: 7.4, turbidity: 5.1, tds: 360, temperature: 24.4, chlorine: 0.31, pressure: 2.9, lastReading: "6 sec ago", trend: [7.3, 7.4, 7.4, 7.5, 7.4] },
  J2: { ph: 7.4, turbidity: 3.2, tds: 340, temperature: 24.2, chlorine: 0.18, pressure: 2.3, lastReading: "6 sec ago", trend: [7.4, 7.4, 7.3, 7.4, 7.4] },
  J3: { ph: 7.2, turbidity: 2.0, tds: 305, temperature: 24.0, chlorine: 0.40, pressure: 3.0, lastReading: "8 sec ago", trend: [7.2, 7.2, 7.1, 7.2, 7.2] },
  SN1: { ph: 7.2, turbidity: 2.1, tds: 180, temperature: 24.0, chlorine: 0.42, pressure: 3.8, flow: 118, lastReading: "4 sec ago", trend: [7.1, 7.15, 7.18, 7.2, 7.2] },
  SN2: { ph: 7.3, turbidity: 2.4, tds: 195, temperature: 24.3, chlorine: 0.22, pressure: 2.8, flow: 112, lastReading: "4 sec ago", trend: [7.3, 7.3, 7.2, 7.3, 7.3] },
};

export const zoneTelemetry = {
  "Z-MINING": {
    waterQuality: 62,
    risk: "High",
    sensors: 0,
    connectedInfra: ["P2", "J1"],
    incidents: ["AL-1042", "AL-1038"],
    note: "No dedicated zone sensor in topology. Feeder P2 is CONTAMINATION.",
  },
  "Z-URBAN": {
    waterQuality: 74,
    risk: "Elevated",
    sensors: 0,
    connectedInfra: ["P6", "J2"],
    incidents: ["AL-1040", "AL-1033"],
    note: "No dedicated zone sensor. Fed by P6 (WARNING).",
  },
  "Z-RURAL": {
    waterQuality: 88,
    risk: "Low",
    sensors: 0,
    connectedInfra: ["P9", "J3"],
    incidents: [],
    note: "No dedicated zone sensor. P9 is NORMAL.",
  },
};

export const pipelineTelemetry = {
  P1: { flow: 120, pressure: 3.3, lastInspection: "22 Aug 2026", alerts: 0 },
  P2: { flow: 88, pressure: 2.6, lastInspection: "01 Sep 2026", alerts: 2, note: "Contamination flag on mining feeder" },
  P3: { flow: 112, pressure: 3.0, lastInspection: "19 Aug 2026", alerts: 0 },
  P4: { flow: 118, pressure: 3.1, lastInspection: "19 Aug 2026", alerts: 0 },
  P5: { flow: 126, pressure: 2.9, lastInspection: "12 Aug 2026", alerts: 0 },
  P6: { flow: 142, pressure: 2.1, lastInspection: "30 Aug 2026", alerts: 1, note: "Urban feeder under warning" },
  P7: { flow: 108, pressure: 2.8, lastInspection: "12 Aug 2026", alerts: 0 },
  P8: { flow: 104, pressure: 2.9, lastInspection: "12 Aug 2026", alerts: 0 },
  P9: { flow: 96, pressure: 3.0, lastInspection: "08 Aug 2026", alerts: 0 },
  P10: { flow: 110, pressure: 3.2, lastInspection: "22 Aug 2026", alerts: 0 },
};

export const analyticsSeries = {
  "24h": {
    labels: ["00", "04", "08", "12", "16", "20", "24"],
    turbidity: [1.8, 1.9, 2.0, 2.2, 2.3, 2.1, 2.1],
    tds: [168, 172, 175, 178, 182, 180, 180],
    temperature: [23.4, 23.6, 24.0, 24.2, 24.4, 24.1, 24.1],
    flow: [108, 112, 120, 124, 118, 116, 118],
    wqi: [90, 89, 88, 87, 86, 86, 86],
  },
  "7d": {
    labels: ["W", "T", "F", "S", "S", "M", "T"],
    turbidity: [1.9, 2.0, 2.1, 2.0, 2.2, 2.1, 2.1],
    tds: [170, 174, 176, 178, 180, 182, 180],
    temperature: [23.8, 24.0, 24.1, 24.2, 24.3, 24.2, 24.1],
    flow: [112, 115, 118, 121, 119, 117, 118],
    wqi: [91, 90, 89, 88, 87, 86, 86],
  },
  "30d": {
    labels: ["W1", "W2", "W3", "W4"],
    turbidity: [2.0, 2.1, 2.0, 2.1],
    tds: [172, 176, 178, 180],
    temperature: [23.9, 24.0, 24.1, 24.1],
    flow: [114, 116, 117, 118],
    wqi: [90, 88, 87, 86],
  },
};

export const treatmentStages = [
  { id: "raw", name: "Raw Water", status: "WARNING", detail: "Intake from W1 treatment plant header.", before: "8.4 NTU", after: "8.4 NTU", reading: "Turbidity inbound" },
  { id: "pre", name: "Pre-filtration", status: "NORMAL", detail: "Screens coarse sediment before clarification.", before: "8.4 NTU", after: "6.1 NTU", reading: "Screen Δ −2.3 NTU" },
  { id: "sed", name: "Sedimentation", status: "NORMAL", detail: "Settling basin — elevate dwell if turbidity stays high.", before: "6.1 NTU", after: "3.8 NTU", reading: "Dwell 42 min" },
  { id: "chem", name: "Chemical Treatment", status: "NORMAL", detail: "Coagulant / pH correction window.", before: "pH 7.8", after: "pH 7.3", reading: "Dose hold" },
  { id: "filt", name: "Filtration", status: "WARNING", detail: "AI recommends increasing this stage now.", before: "3.8 NTU", after: "1.9 NTU", reading: "Headloss rising" },
  { id: "dis", name: "Disinfection", status: "WARNING", detail: "Chlorine residual currently below urban target.", before: "0.12 mg/L", after: "0.18 mg/L", reading: "Residual short" },
  { id: "safe", name: "Safe Water", status: "NORMAL", detail: "Dispatch toward J1 and distribution.", before: "1.9 NTU", after: "1.8 NTU", reading: "W1 header ready" },
];

export const aiModules = [
  { id: "anomaly", title: "Anomaly detection", score: 62, status: "WARNING", text: "SN1 turbidity and SN2 TDS are outside the quiet-band envelope (demo)." },
  { id: "contam", title: "Contamination risk", score: 34, status: "NORMAL", text: "No contamination flag from the 8 physical sensor channels." },
  { id: "leak", title: "Leakage detection", score: 28, status: "NORMAL", text: "Paired flow sensors on SN1/SN2 show no abrupt collapse." },
  { id: "trend", title: "Trend analysis", score: 58, status: "WARNING", text: "SN2 TDS has climbed across the last few intervals." },
  { id: "treat", title: "Treatment recommendations", score: 44, status: "NORMAL", text: "No plant change required from current Turbidity / TDS / Flow / Temp readings." },
  { id: "risk", title: "Network risk score", score: 41, status: "NORMAL", text: "Scope limited to 2 nodes and 8 sensors; residual risk is localized sensor watches." },
];

export const citizenReports = [
  { id: "CR-219", type: "No water", location: "Rural Zone ward 4", time: "18 min ago", status: "OPEN", severity: "WARNING", correlation: "No matching outage on P9. Likely local service connection (demo).", targetId: "Z-RURAL", targetType: "zone" },
  { id: "CR-218", type: "Bad smell", location: "Urban Zone block C", time: "41 min ago", status: "REVIEW", severity: "WARNING", correlation: "Aligns with low chlorine on P6 urban feeder.", targetId: "Z-URBAN", targetType: "zone" },
  { id: "CR-217", type: "Bad taste", location: "Urban Zone block A", time: "1h ago", status: "REVIEW", severity: "WARNING", correlation: "Possible disinfection by-product window; residual is low.", targetId: "Z-URBAN", targetType: "zone" },
  { id: "CR-216", type: "Discoloration", location: "Mining Zone edge", time: "2h ago", status: "LINKED", severity: "CONTAMINATION", correlation: "Strong correlation with P2 contamination into Mining Zone.", targetId: "P2", targetType: "pipeline" },
  { id: "CR-214", type: "Low pressure", location: "Urban Zone tower 2", time: "3h ago", status: "LINKED", severity: "WARNING", correlation: "Matches P6 pressure warning at J2.", targetId: "P6", targetType: "pipeline" },
  { id: "CR-211", type: "Suspected contamination", location: "J1 · Mining feeder", time: "4h ago", status: "ESCALATED", severity: "CONTAMINATION", correlation: "AI flags P2 as the contamination-risk cluster.", targetId: "P2", targetType: "pipeline" },
];

export const operations = [
  { id: "OP-77", incident: "SN1 turbidity watch", action: "Dispatch team", owner: "Field Unit A", status: "IN PROGRESS" },
  { id: "OP-76", incident: "SN2 TDS rising", action: "Recalibrate sensor", owner: "Analyst", status: "QUEUED" },
  { id: "OP-74", incident: "SN1 flow fluctuation", action: "Cross-check SN2 flow", owner: "Control Room", status: "STANDBY" },
  { id: "OP-73", incident: "Paired sensor inspection", action: "Schedule inspection", owner: "Field Unit B", status: "SCHEDULED" },
  { id: "OP-71", incident: "SN2 temperature confirm", action: "Probe seating check", owner: "Field Unit C", status: "QUEUED" },
  { id: "OP-70", incident: "False positive turbidity", action: "Resolve", owner: "Analyst", status: "CLOSED" },
];

/** Node-level health (2 physical sensor nodes). */
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
    note: "Hosts 4 sensors: Turbidity, TDS, Flow, Temperature.",
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
    note: "Hosts 4 sensors: Turbidity, TDS, Flow, Temperature. Shared ESP-32-001 with SN1.",
  },
];

/** 8 physical sensor channels: 4 types × 2 nodes. */
export const sensorInventory = [
  { id: "SN1-TURB", nodeId: "SN1", type: "Turbidity", unit: "NTU", value: 2.1, status: "NORMAL", range: "< 5", lastReading: "4 sec ago" },
  { id: "SN1-TDS", nodeId: "SN1", type: "TDS", unit: "ppm", value: 180, status: "NORMAL", range: "< 300", lastReading: "4 sec ago" },
  { id: "SN1-FLOW", nodeId: "SN1", type: "Flow", unit: "L/min", value: 118, status: "NORMAL", range: "80 – 160", lastReading: "4 sec ago" },
  { id: "SN1-TEMP", nodeId: "SN1", type: "Temperature", unit: "°C", value: 24.0, status: "NORMAL", range: "10 – 30", lastReading: "4 sec ago" },
  { id: "SN2-TURB", nodeId: "SN2", type: "Turbidity", unit: "NTU", value: 2.4, status: "NORMAL", range: "< 5", lastReading: "4 sec ago" },
  { id: "SN2-TDS", nodeId: "SN2", type: "TDS", unit: "ppm", value: 195, status: "WARNING", range: "< 300", lastReading: "4 sec ago" },
  { id: "SN2-FLOW", nodeId: "SN2", type: "Flow", unit: "L/min", value: 112, status: "NORMAL", range: "80 – 160", lastReading: "4 sec ago" },
  { id: "SN2-TEMP", nodeId: "SN2", type: "Temperature", unit: "°C", value: 24.3, status: "NORMAL", range: "10 – 30", lastReading: "4 sec ago" },
];

export const reports = [
  { id: "R-12", title: "Daily Water Quality", period: "02 Sep 2026", status: "Ready", summary: "WQI 86 from SN1/SN2 channels: Turbidity, TDS, Flow, Temperature." },
  { id: "R-11", title: "Treatment", period: "Shift A", status: "Ready", summary: "Plant stages unchanged. Field evidence limited to 8 physical sensors." },
  { id: "R-10", title: "Incident", period: "Last 24h", status: "Ready", summary: "3 open sensor watches on SN1 turbidity / flow and SN2 TDS." },
  { id: "R-09", title: "Sensor Health", period: "02 Sep 2026", status: "Ready", summary: "2 nodes · 8 sensors online on shared ESP-32-001. Battery 76% (demo)." },
  { id: "R-08", title: "Node Quality", period: "02 Sep 2026", status: "Ready", summary: "SN1 and SN2 both online. Paired sensors: Turbidity×2, TDS×2, Flow×2, Temp×2." },
];
