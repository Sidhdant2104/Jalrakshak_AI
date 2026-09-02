import { useEffect, useMemo, useRef, useState } from "react";
import { prototypeNetwork } from "../../data/prototypeNetwork";
import { findNode, getVisualConnectionPoint, polygonCentroid } from "../../utils/networkGeometry";
import { statusColor } from "../../utils/status";

const BASE_VIEW = { x: 0, y: 0, w: 1200, h: 700 };

function zoneFill(zone) {
  const alpha = "22";
  if (zone.zoneType === "MINING") return `#f59e0b${alpha}`;
  if (zone.zoneType === "URBAN") return `#38bdf8${alpha}`;
  if (zone.zoneType === "RURAL") return `#34d399${alpha}`;
  return `#60a5fa${alpha}`;
}

function nodeShape(type) {
  if (type === "WATER_SOURCE") return "source";
  if (type === "SENSORS") return "sensor";
  if (type === "JUNCTION") return "junction";
  return "default";
}

export default function NetworkMap({
  selectedId = null,
  onSelect,
  showGrid = true,
  interactive = true,
  compact = false,
}) {
  const { nodes, pipelines, valves = [] } = prototypeNetwork;
  const svgRef = useRef(null);
  const [view, setView] = useState(BASE_VIEW);
  const [tooltip, setTooltip] = useState(null);
  const drag = useRef(null);

  const selectedStroke = "#e2e8ff";

  const zoomBy = (factor) => {
    setView((v) => {
      const nw = Math.max(280, Math.min(1200, v.w * factor));
      const nh = nw * (700 / 1200);
      return {
        x: v.x + (v.w - nw) / 2,
        y: v.y + (v.h - nh) / 2,
        w: nw,
        h: nh,
      };
    });
  };

  const resetView = () => setView(BASE_VIEW);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !interactive) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      zoomBy(event.deltaY > 0 ? 1.12 : 0.9);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [interactive]);

  const onPointerDown = (event) => {
    if (!interactive || event.button !== 0) return;
    if (event.target.closest?.("[data-hit]")) return;
    const rect = svgRef.current.getBoundingClientRect();
    drag.current = {
      cx: event.clientX,
      cy: event.clientY,
      view,
      sx: view.w / rect.width,
      sy: view.h / rect.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!drag.current) return;
    const dx = (event.clientX - drag.current.cx) * drag.current.sx;
    const dy = (event.clientY - drag.current.cy) * drag.current.sy;
    setView({
      ...drag.current.view,
      x: drag.current.view.x - dx,
      y: drag.current.view.y - dy,
    });
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const showTip = (event, text) => {
    const rect = svgRef.current?.parentElement?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      x: event.clientX - rect.left + 12,
      y: event.clientY - rect.top + 12,
      text,
    });
  };

  const select = (payload) => {
    onSelect?.(payload);
  };

  const labelFont = compact ? 11 : 13;

  const zoneNodes = useMemo(() => nodes.filter((n) => n.type === "ZONE"), [nodes]);
  const infraNodes = useMemo(() => nodes.filter((n) => n.type !== "ZONE"), [nodes]);

  return (
    <div className="map-canvas">
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        width="100%"
        height="100%"
        className="network-svg"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          onPointerUp();
          setTooltip(null);
        }}
        onClick={(e) => {
          if (e.target === svgRef.current) onSelect?.(null);
        }}
      >
        <defs>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {showGrid &&
          Array.from({ length: 13 }, (_, i) => {
            const x = i * 100;
            return (
              <line key={`vx-${x}`} x1={x} y1="0" x2={x} y2="700" stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
            );
          })}
        {showGrid &&
          Array.from({ length: 8 }, (_, i) => {
            const y = i * 100;
            return (
              <line key={`hy-${y}`} x1="0" y1={y} x2="1200" y2={y} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
            );
          })}

        {zoneNodes.map((zone) => {
          const points = zone.geometry?.coordinates?.map((p) => `${p.x},${p.y}`).join(" ");
          if (!points) return null;
          const label = zone.labelPosition ?? polygonCentroid(zone.geometry.coordinates);
          const active = selectedId === zone.id;
          return (
            <g
              key={zone.id}
              data-hit
              className="map-hit"
              onClick={(e) => {
                e.stopPropagation();
                select({ kind: "zone", id: zone.id, data: zone });
              }}
              onMouseMove={(e) => showTip(e, `${zone.name} · ${zone.status}`)}
              onMouseLeave={() => setTooltip(null)}
            >
              <polygon
                points={points}
                fill={zoneFill(zone)}
                stroke={active ? selectedStroke : statusColor(zone.status)}
                strokeWidth={active ? 3 : 2}
                strokeDasharray="7 5"
              />
              <text x={label.x} y={label.y} textAnchor="middle" fontSize={labelFont + 1} fontWeight="700" fill="#dbe7ff">
                {zone.name}
              </text>
              <text x={label.x} y={label.y + 18} textAnchor="middle" fontSize="11" fill="#93a4c7">
                {zone.zoneType}
              </text>
            </g>
          );
        })}

        {pipelines.map((pipeline) => {
          const fromNode = findNode(nodes, pipeline.from);
          const toNode = findNode(nodes, pipeline.to);
          const from = getVisualConnectionPoint(fromNode);
          const to = getVisualConnectionPoint(toNode);
          if (!from || !to) return null;
          const color = statusColor(pipeline.status);
          const active = selectedId === pipeline.id;
          const critical = pipeline.status === "CRITICAL" || pipeline.status === "LEAKAGE";
          return (
            <g
              key={pipeline.id}
              data-hit
              className="map-hit"
              onClick={(e) => {
                e.stopPropagation();
                select({ kind: "pipeline", id: pipeline.id, data: pipeline, from, to });
              }}
              onMouseMove={(e) => showTip(e, `${pipeline.id} · ${pipeline.from} → ${pipeline.to} · ${pipeline.status}`)}
              onMouseLeave={() => setTooltip(null)}
            >
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="transparent" strokeWidth="22" />
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={color}
                strokeWidth={active ? 10 : 6}
                strokeLinecap="round"
                filter={critical ? "url(#glow)" : undefined}
                className={critical ? "pipe-pulse" : undefined}
              />
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 10}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#c5d4f0"
              >
                {pipeline.id}
              </text>
            </g>
          );
        })}

        {infraNodes.map((node) => {
          if (!node.position) return null;
          const { x, y } = node.position;
          const color = statusColor(node.status);
          const active = selectedId === node.id;
          const shape = nodeShape(node.type);
          return (
            <g
              key={node.id}
              data-hit
              className="map-hit"
              onClick={(e) => {
                e.stopPropagation();
                select({ kind: "node", id: node.id, data: node });
              }}
              onMouseMove={(e) => showTip(e, `${node.name} (${node.id}) · ${node.status}`)}
              onMouseLeave={() => setTooltip(null)}
            >
              {shape === "junction" && (
                <rect
                  x={x - 16}
                  y={y - 16}
                  width="32"
                  height="32"
                  rx="4"
                  fill="#0b1220"
                  stroke={active ? selectedStroke : color}
                  strokeWidth={active ? 3 : 2.5}
                  transform={`rotate(45 ${x} ${y})`}
                />
              )}
              {shape === "sensor" && (
                <rect
                  x={x - 16}
                  y={y - 16}
                  width="32"
                  height="32"
                  rx="8"
                  fill="#0b1220"
                  stroke={active ? selectedStroke : color}
                  strokeWidth={active ? 3 : 2.5}
                />
              )}
              {shape === "source" && (
                <circle
                  cx={x}
                  cy={y}
                  r="20"
                  fill="#0b1220"
                  stroke={active ? selectedStroke : color}
                  strokeWidth={active ? 3 : 2.5}
                />
              )}
              {shape === "default" && (
                <circle cx={x} cy={y} r="18" fill="#0b1220" stroke={active ? selectedStroke : color} strokeWidth="2.5" />
              )}
              <circle cx={x} cy={y} r="6" fill={color} />
              <text x={x} y={y + 36} textAnchor="middle" fontSize={labelFont} fontWeight="700" fill="#f1f5ff">
                {compact ? node.id : node.name}
              </text>
              {!compact && (
                <text x={x} y={y + 50} textAnchor="middle" fontSize="10" fill="#8ea0c3">
                  {node.id}
                  {node.device_id ? ` · ${node.device_id}` : ""}
                </text>
              )}
            </g>
          );
        })}

        {valves.map((valve) => {
          if (!valve.position) return null;
          const { x, y } = valve.position;
          const active = selectedId === valve.id;
          return (
            <g
              key={valve.id}
              data-hit
              className="map-hit"
              onClick={(e) => {
                e.stopPropagation();
                select({ kind: "valve", id: valve.id, data: valve });
              }}
              onMouseMove={(e) => showTip(e, `${valve.name} · ${valve.state}`)}
              onMouseLeave={() => setTooltip(null)}
            >
              <rect
                x={x - 10}
                y={y - 10}
                width="20"
                height="20"
                fill="#0b1220"
                stroke={active ? selectedStroke : "#e2e8ff"}
                strokeWidth="2.5"
                transform={`rotate(45 ${x} ${y})`}
              />
              <text x={x} y={y - 18} textAnchor="middle" fontSize="11" fontWeight="700" fill="#dbe7ff">
                {valve.name}
              </text>
              <text x={x} y={y + 26} textAnchor="middle" fontSize="10" fill="#8ea0c3">
                {valve.state}
              </text>
            </g>
          );
        })}
      </svg>

      {interactive && (
        <div className="map-controls">
          <button type="button" onClick={() => zoomBy(0.85)} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={() => zoomBy(1.15)} aria-label="Zoom out">
            −
          </button>
          <button type="button" onClick={resetView} className="wide">
            Reset view
          </button>
        </div>
      )}

      {tooltip && (
        <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
