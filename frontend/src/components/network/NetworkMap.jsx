import { useEffect, useId, useMemo, useRef, useState } from "react";
import { prototypeNetwork } from "../../data/prototypeNetwork";
import {
  BASE_VIEW,
  connectedPipelineIds,
  FIT_VIEW,
  findNode,
  getEntityAnchor,
  getVisualConnectionPoint,
  neighborNodeIds,
  polygonCentroid,
  viewAround,
} from "../../utils/networkGeometry";
import { matchesStatusFilter, statusColor } from "../../utils/status";
import { useTheme } from "../../hooks/useTheme";

function zoneFill(zone) {
  if (zone.zoneType === "MINING") return "rgba(245, 158, 11, 0.12)";
  if (zone.zoneType === "URBAN") return "rgba(56, 189, 248, 0.12)";
  if (zone.zoneType === "RURAL") return "rgba(52, 211, 153, 0.12)";
  return "rgba(96, 165, 250, 0.1)";
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
  compact = false,
  interactive = true,
  layers = { zones: true, sensors: true, infra: true, pipes: true },
  statusFilter = "all",
  focusId = null,
  focusToken = 0,
  command = null,
}) {
  const { nodes, pipelines, valves = [] } = prototypeNetwork;
  const [theme] = useTheme();
  const markerFill = theme === "light" ? "#ffffff" : "#08101d";
  const labelFill = theme === "light" ? "#172033" : "#f3f6ff";
  const idFill = theme === "light" ? "#667085" : "#8b9cc0";
  const svgRef = useRef(null);
  const uid = useId().replace(/:/g, "");
  const [view, setView] = useState(BASE_VIEW);
  const [tooltip, setTooltip] = useState(null);
  const [hovered, setHovered] = useState(null);
  const drag = useRef(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  const glow = `glow-${uid}`;
  const halo = `halo-${uid}`;

  const zoomBy = (factor, origin) => {
    setView((v) => {
      const nw = Math.max(240, Math.min(1400, v.w * factor));
      const nh = nw * (700 / 1200);
      const cx = origin?.x ?? v.x + v.w / 2;
      const cy = origin?.y ?? v.y + v.h / 2;
      const rx = (cx - v.x) / v.w;
      const ry = (cy - v.y) / v.h;
      return { x: cx - nw * rx, y: cy - nh * ry, w: nw, h: nh };
    });
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !interactive) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      const v = viewRef.current;
      const rect = svg.getBoundingClientRect();
      const origin = {
        x: v.x + ((event.clientX - rect.left) / rect.width) * v.w,
        y: v.y + ((event.clientY - rect.top) / rect.height) * v.h,
      };
      zoomBy(event.deltaY > 0 ? 1.12 : 0.88, origin);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [interactive]);

  useEffect(() => {
    if (!focusId) return;
    const point = getEntityAnchor(prototypeNetwork, focusId);
    if (point) setView(viewAround(point, compact ? 1.15 : 1));
  }, [focusId, focusToken, compact]);

  useEffect(() => {
    if (!command) return;
    if (command.type === "reset") setView(BASE_VIEW);
    if (command.type === "fit") setView(FIT_VIEW);
    if (command.type === "in") zoomBy(0.85);
    if (command.type === "out") zoomBy(1.18);
  }, [command]);

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

  const highlight = useMemo(() => {
    const id = hovered || selectedId;
    if (!id) return null;
    const node = findNode(nodes, id);
    if (node) {
      return {
        nodes: neighborNodeIds(prototypeNetwork, id),
        pipes: new Set(connectedPipelineIds(prototypeNetwork, id)),
      };
    }
    const pipe = pipelines.find((p) => p.id === id);
    if (pipe) return { nodes: new Set([pipe.from, pipe.to]), pipes: new Set([pipe.id]) };
    return { nodes: new Set([id]), pipes: new Set() };
  }, [hovered, selectedId, nodes, pipelines]);

  const isHot = (kind, id) => {
    if (!highlight) return true;
    if (kind === "pipe") return highlight.pipes.has(id);
    return highlight.nodes.has(id);
  };

  const showTip = (event, text) => {
    const rect = svgRef.current?.parentElement?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: event.clientX - rect.left + 14, y: event.clientY - rect.top + 12, text });
  };

  const zoneNodes = nodes.filter((n) => n.type === "ZONE");
  const infraNodes = nodes.filter((n) => n.type !== "ZONE");
  const labelFont = compact ? 10 : 12;

  const jumpMinimap = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1200;
    const y = ((event.clientY - rect.top) / rect.height) * 700;
    setView((v) => ({ ...v, x: x - v.w / 2, y: y - v.h / 2 }));
  };

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
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
          setTooltip(null);
          setHovered(null);
        }}
        onClick={(e) => {
          if (e.target === svgRef.current) onSelect?.(null);
        }}
      >
        <defs>
          <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={halo} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: 13 }, (_, i) => (
          <line key={`vx-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="700" stroke="rgba(80,120,180,0.1)" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`hy-${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} stroke="rgba(80,120,180,0.1)" />
        ))}

        {layers.zones &&
          zoneNodes.map((zone) => {
            const points = zone.geometry?.coordinates?.map((p) => `${p.x},${p.y}`).join(" ");
            if (!points) return null;
            const label = zone.labelPosition ?? polygonCentroid(zone.geometry.coordinates);
            const active = selectedId === zone.id || hovered === zone.id;
            const pass = matchesStatusFilter(zone.status, statusFilter);
            return (
              <g
                key={zone.id}
                data-hit
                className="map-hit"
                opacity={pass && isHot("node", zone.id) ? 1 : 0.18}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.({ kind: "zone", id: zone.id, data: zone });
                }}
                onMouseEnter={() => setHovered(zone.id)}
                onMouseMove={(e) => showTip(e, `${zone.name} · ${zone.zoneType} · ${zone.status}`)}
                onMouseLeave={() => {
                  setHovered(null);
                  setTooltip(null);
                }}
              >
                <polygon
                  points={points}
                  fill={zoneFill(zone)}
                  stroke={active ? "#c4b5fd" : statusColor(zone.status)}
                  strokeWidth={active ? 2.6 : 1.6}
                  strokeDasharray="6 5"
                />
                <text x={label.x} y={label.y} textAnchor="middle" fontSize={labelFont + 1} fontWeight="700" fill="#d7e3ff">
                  {zone.name}
                </text>
                <text x={label.x} y={label.y + 16} textAnchor="middle" fontSize="10" fill="#8ea0c7">
                  {zone.zoneType}
                </text>
              </g>
            );
          })}

        {layers.pipes &&
          pipelines.map((pipeline) => {
            const fromNode = findNode(nodes, pipeline.from);
            const toNode = findNode(nodes, pipeline.to);
            const from = getVisualConnectionPoint(fromNode);
            const to = getVisualConnectionPoint(toNode);
            if (!from || !to) return null;
            const color = statusColor(pipeline.status);
            const active = selectedId === pipeline.id || hovered === pipeline.id;
            const stressed = pipeline.status === "CRITICAL" || pipeline.status === "LEAKAGE" || pipeline.status === "CONTAMINATION";
            const pass = matchesStatusFilter(pipeline.status, statusFilter);
            const pathId = `${uid}-${pipeline.id}`;
            return (
              <g
                key={pipeline.id}
                data-hit
                className="map-hit"
                opacity={pass && isHot("pipe", pipeline.id) ? 1 : 0.16}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.({ kind: "pipeline", id: pipeline.id, data: pipeline });
                }}
                onMouseEnter={() => setHovered(pipeline.id)}
                onMouseMove={(e) => showTip(e, `${pipeline.id}  ${pipeline.from} → ${pipeline.to}  ${pipeline.status}`)}
                onMouseLeave={() => {
                  setHovered(null);
                  setTooltip(null);
                }}
              >
                <path id={pathId} d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`} fill="none" stroke="transparent" />
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="transparent" strokeWidth="22" />
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={color}
                  strokeWidth={active ? 9 : 5.5}
                  strokeLinecap="butt"
                  filter={`url(#${glow})`}
                  className={stressed ? "pipe-pulse" : undefined}
                />
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(226,232,255,0.55)"
                  strokeWidth="1.4"
                  strokeDasharray="5 16"
                  className="flow-dash"
                />
                <circle r={stressed ? 3.4 : 2.4} fill="#eef4ff" opacity="0.9">
                  <animateMotion dur={stressed ? "1.6s" : "2.8s"} repeatCount="indefinite" rotate="auto">
                    <mpath href={`#${pathId}`} />
                  </animateMotion>
                </circle>
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 9}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#c9d7f5"
                >
                  {pipeline.id}
                </text>
              </g>
            );
          })}

        {infraNodes.map((node) => {
          if (!node.position) return null;
          if (node.type === "SENSORS" && !layers.sensors) return null;
          if (node.type !== "SENSORS" && !layers.infra) return null;
          const { x, y } = node.position;
          const color = statusColor(node.status);
          const active = selectedId === node.id || hovered === node.id;
          const shape = nodeShape(node.type);
          const pass = matchesStatusFilter(node.status, statusFilter);
          return (
            <g
              key={node.id}
              data-hit
              className="map-hit"
              opacity={pass && isHot("node", node.id) ? 1 : 0.16}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.({ kind: node.type === "SENSORS" ? "sensor" : "node", id: node.id, data: node });
              }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseMove={(e) => showTip(e, `${node.name} (${node.id}) · ${node.status}`)}
              onMouseLeave={() => {
                setHovered(null);
                setTooltip(null);
              }}
            >
              {active && <circle cx={x} cy={y} r="26" fill={color} opacity="0.18" filter={`url(#${halo})`} />}
              {shape === "junction" && (
                <rect
                  x={x - 15}
                  y={y - 15}
                  width="30"
                  height="30"
                  fill={markerFill}
                  stroke={color}
                  strokeWidth={active ? 2.8 : 2}
                  transform={`rotate(45 ${x} ${y})`}
                />
              )}
              {shape === "sensor" && (
                <rect x={x - 15} y={y - 15} width="30" height="30" rx="3" fill={markerFill} stroke={color} strokeWidth={active ? 2.8 : 2} />
              )}
              {shape === "source" && (
                <circle cx={x} cy={y} r="18" fill={markerFill} stroke={color} strokeWidth={active ? 2.8 : 2} />
              )}
              {shape === "default" && <circle cx={x} cy={y} r="16" fill={markerFill} stroke={color} strokeWidth="2" />}
              <circle cx={x} cy={y} r="5" fill={color} />
              <text x={x} y={y + 34} textAnchor="middle" fontSize={labelFont} fontWeight="700" fill={labelFill}>
                {compact ? node.id : node.name}
              </text>
              {!compact && (
                <text x={x} y={y + 48} textAnchor="middle" fontSize="10" fill={idFill}>
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
          return (
            <g key={valve.id} data-hit onClick={(e) => { e.stopPropagation(); onSelect?.({ kind: "valve", id: valve.id, data: valve }); }}>
              <rect x={x - 9} y={y - 9} width="18" height="18" fill={markerFill} stroke="#e2e8ff" transform={`rotate(45 ${x} ${y})`} />
            </g>
          );
        })}
      </svg>

      {interactive && (
        <>
          <div className="map-controls">
            <button type="button" onClick={() => zoomBy(0.85)} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => zoomBy(1.18)} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => setView(BASE_VIEW)}>Reset</button>
            <button type="button" onClick={() => setView(FIT_VIEW)}>Fit</button>
          </div>
          <button type="button" className="minimap" onClick={jumpMinimap} aria-label="Minimap">
            <svg viewBox="0 0 1200 700">
              {pipelines.map((p) => {
                const a = getVisualConnectionPoint(findNode(nodes, p.from));
                const b = getVisualConnectionPoint(findNode(nodes, p.to));
                if (!a || !b) return null;
                return <line key={p.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={statusColor(p.status)} strokeWidth="10" />;
              })}
              <rect x={view.x} y={view.y} width={view.w} height={view.h} fill="none" stroke="#c4b5fd" strokeWidth="14" />
            </svg>
          </button>
        </>
      )}

      {tooltip && (
        <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
