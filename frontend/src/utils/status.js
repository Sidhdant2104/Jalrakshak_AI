export const STATUS_COLORS = {
  NORMAL: "#22d3a6",
  ONLINE: "#22d3a6",
  WARNING: "#f5c542",
  CRITICAL: "#f43f5e",
  LEAKAGE: "#f43f5e",
  CONTAMINATION: "#c084fc",
  OFFLINE: "#64748b",
};

export function statusColor(status) {
  return STATUS_COLORS[status] || "#94a3b8";
}

export function statusLabel(status) {
  if (!status) return "Unknown";
  return String(status)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function statusTone(status) {
  switch (status) {
    case "NORMAL":
    case "ONLINE":
    case "HEALTHY":
      return "ok";
    case "WARNING":
      return "warn";
    case "CRITICAL":
    case "LEAKAGE":
      return "crit";
    case "CONTAMINATION":
      return "contam";
    case "OFFLINE":
      return "off";
    default:
      return "off";
  }
}

export function matchesStatusFilter(status, filter) {
  if (!filter || filter === "all") return true;
  const tone = statusTone(status);
  if (filter === "healthy") return tone === "ok";
  if (filter === "warning") return tone === "warn";
  if (filter === "critical") return tone === "crit" || tone === "contam";
  if (filter === "offline") return tone === "off";
  return true;
}
