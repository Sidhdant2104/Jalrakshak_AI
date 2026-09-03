export default function Sparkline({
  data = [],
  width = 88,
  height = 28,
  color = "#60a5fa",
  fill = false,
  strokeWidth = 2,
}) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = data.length === 1 ? 0 : width / (data.length - 1);
  const coords = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / span) * (height - 4) - 2;
    return [x, y];
  });
  const points = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${coords[0][0]},${height} ${points} ${coords[coords.length - 1][0]},${height}`;

  return (
    <svg className="sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {fill ? <polygon fill={color} fillOpacity="0.16" points={area} /> : null}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

export function MiniBars({ data = [], width = 72, height = 28, color = "#35D978" }) {
  if (!data.length) return null;
  const max = Math.max(...data) || 1;
  const gap = 3;
  const barW = (width - gap * (data.length - 1)) / data.length;
  return (
    <svg className="sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {data.map((v, i) => {
        const h = Math.max(3, (v / max) * (height - 2));
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={height - h}
            width={barW}
            height={h}
            rx="1.5"
            fill={color}
            opacity={0.45 + (i / data.length) * 0.55}
          />
        );
      })}
    </svg>
  );
}
