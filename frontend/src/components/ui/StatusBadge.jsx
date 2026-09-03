import { statusLabel, statusTone } from "../../utils/status";

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${statusTone(status)}`}>{statusLabel(status)}</span>;
}
