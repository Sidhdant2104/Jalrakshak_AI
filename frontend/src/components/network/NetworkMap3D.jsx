import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Grid, Line, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { prototypeNetwork } from "../../data/prototypeNetwork";
import { polygonCentroid } from "../../utils/networkGeometry";
import { matchesStatusFilter, statusColor } from "../../utils/status";
import { useTheme } from "../../hooks/useTheme";
import {
  DEFAULT_CAMERA_POS,
  highlightSet,
  isHot,
  NETWORK_CENTER,
  PIPE_Y,
  pipeEnds,
  toWorld,
  ZONE_TOP,
} from "../../utils/world3d";

const { nodes, pipelines } = prototypeNetwork;

function CameraRig({ command, focusId, focusToken, controlsRef }) {
  const { camera } = useThree();

  const fit = () => {
    camera.position.set(...DEFAULT_CAMERA_POS);
    if (controlsRef.current) {
      controlsRef.current.target.set(...NETWORK_CENTER);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    fit();
  }, []);

  useEffect(() => {
    if (!command) return;
    if (command.type === "reset" || command.type === "fit") fit();
    if (!controlsRef.current) return;
    const t = controlsRef.current.target;
    if (command.type === "in") {
      camera.position.lerp(t, 0.18);
      controlsRef.current.update();
    }
    if (command.type === "out") {
      camera.position.x += (camera.position.x - t.x) * 0.2;
      camera.position.y += (camera.position.y - t.y) * 0.2;
      camera.position.z += (camera.position.z - t.z) * 0.2;
      controlsRef.current.update();
    }
  }, [command, camera, controlsRef]);

  useEffect(() => {
    if (!focusId || !controlsRef.current) return;
    const node = nodes.find((n) => n.id === focusId);
    const pipe = pipelines.find((p) => p.id === focusId);
    let x = NETWORK_CENTER[0];
    let z = NETWORK_CENTER[2];
    if (node) {
      const p = node.position || node.connectionPoint || polygonCentroid(node.geometry?.coordinates || []);
      if (p) {
        x = p.x;
        z = p.y;
      }
    } else if (pipe) {
      const { from, to } = pipeEnds(pipe);
      if (from && to) {
        x = (from.x + to.x) / 2;
        z = (from.y + to.y) / 2;
      }
    }
    const t = controlsRef.current.target;
    const offset = camera.position.clone().sub(t);
    t.set(x, 10, z);
    camera.position.copy(t).add(offset);
    controlsRef.current.update();
  }, [focusId, focusToken, camera, controlsRef]);

  return null;
}

function ZonePlatform({ zone, active, dim, onHover, onSelect }) {
  const geometry = useMemo(() => {
    const coords = zone.geometry?.coordinates;
    if (!coords?.length) return null;
    const shape = new THREE.Shape();
    coords.forEach((p, i) => {
      if (i === 0) shape.moveTo(p.x, p.y);
      else shape.lineTo(p.x, p.y);
    });
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: ZONE_TOP, bevelEnabled: false, steps: 1 });
    geo.rotateX(Math.PI / 2);
    return geo;
  }, [zone]);

  const edge = useMemo(() => {
    const coords = zone.geometry?.coordinates || [];
    return coords.map((p) => [p.x, ZONE_TOP + 0.4, p.y]).concat([[coords[0].x, ZONE_TOP + 0.4, coords[0].y]]);
  }, [zone]);

  const label = zone.labelPosition ?? polygonCentroid(zone.geometry.coordinates);
  const tint =
    zone.zoneType === "MINING" ? "#7c6bff" : zone.zoneType === "URBAN" ? "#3b82c8" : "#2f9d8a";

  if (!geometry) return null;

  return (
    <group>
      <mesh
        geometry={geometry}
        position={[0, ZONE_TOP, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(zone, e);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect({ kind: "zone", id: zone.id, data: zone });
        }}
      >
        <meshPhysicalMaterial
          color={tint}
          transparent
          opacity={dim ? 0.08 : active ? 0.38 : 0.22}
          roughness={0.25}
          metalness={0.05}
          transmission={0.15}
          thickness={2}
          emissive={tint}
          emissiveIntensity={active ? 0.35 : 0.12}
          depthWrite={false}
        />
      </mesh>
      <Line points={edge} color={active ? "#e0d7ff" : tint} lineWidth={active ? 2.4 : 1.4} transparent opacity={dim ? 0.15 : 0.9} />
      {label && (
        <Billboard position={[label.x, ZONE_TOP + 22, label.y]}>
          <Text fontSize={14} color="#dce6ff" anchorX="center" anchorY="middle" outlineWidth={0.4} outlineColor="#061018">
            {zone.name}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function PipeTube({ pipeline, dim, onHover, onSelect, flow }) {
  const { from, to } = pipeEnds(pipeline);
  const color = statusColor(pipeline.status);
  const stressed = pipeline.status === "CRITICAL" || pipeline.status === "LEAKAGE" || pipeline.status === "CONTAMINATION";
  const mat = useRef();
  const data = useMemo(() => {
    if (!from || !to) return null;
    const a = new THREE.Vector3(from.x, PIPE_Y, from.y);
    const b = new THREE.Vector3(to.x, PIPE_Y, to.y);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { mid, quat, len, a, b };
  }, [from, to]);

  useFrame(({ clock }) => {
    if (!mat.current) return;
    if (stressed && !dim) {
      mat.current.emissiveIntensity = 0.85 + Math.sin(clock.elapsedTime * 5) * 0.4;
    }
  });

  if (!data) return null;

  return (
    <group>
      <mesh
        position={data.mid}
        quaternion={data.quat}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(pipeline, e);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect({ kind: "pipeline", id: pipeline.id, data: pipeline });
        }}
      >
        <cylinderGeometry args={[dim ? 2.2 : 3.1, dim ? 2.2 : 3.1, data.len, 12]} />
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={dim ? 0.06 : 0.7}
          roughness={0.32}
          metalness={0.18}
          transparent
          opacity={dim ? 0.18 : 0.95}
        />
      </mesh>
      {flow && !dim && (
        <>
          <FlowDot a={data.a} b={data.b} color="#eef4ff" speed={stressed ? 0.55 : 0.28} phase={0} />
          <FlowDot a={data.a} b={data.b} color={color} speed={stressed ? 0.55 : 0.28} phase={0.5} />
        </>
      )}
    </group>
  );
}

function FlowDot({ a, b, color, speed, phase }) {
  const ref = useRef();
  const t = useRef(phase);
  useFrame((_, dt) => {
    if (!ref.current) return;
    t.current = (t.current + dt * speed) % 1;
    ref.current.position.lerpVectors(a, b, t.current);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.15, 10, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function NodeMarker({ node, active, dim, onHover, onSelect }) {
  const color = statusColor(node.status);
  const { x, y } = node.position;
  const kind =
    node.id === "W1" ? "plant" : node.id === "W2" ? "reservoir" : node.type === "SENSORS" ? "sensor" : "junction";
  const payload = { kind: node.type === "SENSORS" ? "sensor" : "node", id: node.id, data: node };

  return (
    <group
      position={toWorld(x, y, 0)}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(node, e);
      }}
      onPointerOut={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(payload);
      }}
    >
      {active && (
        <mesh position={[0, 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[18, 24, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.45} toneMapped={false} />
        </mesh>
      )}
      {kind === "plant" && (
        <>
          <mesh position={[0, 9, 0]}>
            <boxGeometry args={[26, 18, 20]} />
            <meshStandardMaterial color="#152238" metalness={0.25} roughness={0.45} />
          </mesh>
          <mesh position={[-8, 22, 0]}>
            <cylinderGeometry args={[5.5, 5.5, 16, 18]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={dim ? 0.1 : 0.55} />
          </mesh>
          <mesh position={[8, 20, 2]}>
            <cylinderGeometry args={[6.5, 6.5, 12, 18]} />
            <meshStandardMaterial color="#9bb7ff" emissive="#4f6dff" emissiveIntensity={dim ? 0.08 : 0.35} />
          </mesh>
        </>
      )}
      {kind === "reservoir" && (
        <mesh position={[0, 10, 0]}>
          <cylinderGeometry args={[16, 16, 18, 28]} />
          <meshStandardMaterial color="#1a3358" emissive={color} emissiveIntensity={dim ? 0.08 : 0.4} metalness={0.3} roughness={0.35} />
        </mesh>
      )}
      {kind === "junction" && (
        <mesh position={[0, 12, 0]} rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[11, 0]} />
          <meshStandardMaterial color="#101a2e" emissive={color} emissiveIntensity={dim ? 0.12 : 0.7} metalness={0.2} roughness={0.3} />
        </mesh>
      )}
      {kind === "sensor" && (
        <>
          <mesh position={[0, 14, 0]}>
            <cylinderGeometry args={[2.2, 2.8, 28, 10]} />
            <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, 29, 0]}>
            <sphereGeometry args={[4.2, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={dim ? 0.15 : 0.9} />
          </mesh>
        </>
      )}
      <Billboard position={[0, kind === "sensor" ? 38 : 34, 0]}>
        <Text fontSize={11} color="#eef3ff" anchorX="center" outlineWidth={0.35} outlineColor="#050b14">
          {node.id}
        </Text>
      </Billboard>
      <mesh visible={false} position={[0, 12, 0]}>
        <sphereGeometry args={[18, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

function Scene({
  selectedId,
  hoveredId,
  layers,
  statusFilter,
  flow,
  grid,
  onSelect,
  onHover,
  command,
  focusId,
  focusToken,
  controlsRef,
  palette,
}) {
  const highlight = highlightSet(hoveredId || selectedId);

  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, 850, 2600]} />
      <ambientLight intensity={palette.ambient} />
      <hemisphereLight args={[palette.hemiSky, palette.hemiGround, 0.4]} />
      <directionalLight position={[420, 620, 160]} intensity={0.9} color={palette.keyLight} />
      <directionalLight position={[-260, 280, 420]} intensity={0.32} color={palette.fillLight} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[600, -0.4, 350]} receiveShadow>
        <planeGeometry args={[1800, 1200]} />
        <meshStandardMaterial color={palette.ground} />
      </mesh>

      {grid && (
        <Grid
          position={[600, 0.02, 350]}
          args={[1400, 900]}
          cellSize={100}
          cellThickness={0.55}
          cellColor={palette.gridCell}
          sectionSize={200}
          sectionThickness={1.05}
          sectionColor={palette.gridSection}
          fadeDistance={2400}
          infiniteGrid={false}
        />
      )}

      <CameraRig command={command} focusId={focusId} focusToken={focusToken} controlsRef={controlsRef} />
        <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={160}
        maxDistance={1700}
        minPolarAngle={0.28}
        maxPolarAngle={Math.PI / 2.12}
        target={NETWORK_CENTER}
      />

      {layers.zones &&
        nodes
          .filter((n) => n.type === "ZONE")
          .map((zone) => {
            const dim = !matchesStatusFilter(zone.status, statusFilter) || !isHot(highlight, "node", zone.id);
            return (
              <ZonePlatform
                key={zone.id}
                zone={zone}
                active={selectedId === zone.id || hoveredId === zone.id}
                dim={dim}
                onHover={onHover}
                onSelect={onSelect}
              />
            );
          })}

      {layers.pipes &&
        pipelines.map((pipeline) => {
          const dim = !matchesStatusFilter(pipeline.status, statusFilter) || !isHot(highlight, "pipe", pipeline.id);
          return (
            <PipeTube
              key={pipeline.id}
              pipeline={pipeline}
              dim={dim}
              flow={flow}
              onHover={onHover}
              onSelect={onSelect}
            />
          );
        })}

      {nodes
        .filter((n) => n.type !== "ZONE" && n.position)
        .filter((n) => (n.type === "SENSORS" ? layers.sensors : layers.infra))
        .map((node) => {
          const dim = !matchesStatusFilter(node.status, statusFilter) || !isHot(highlight, "node", node.id);
          return (
            <NodeMarker
              key={node.id}
              node={node}
              active={selectedId === node.id || hoveredId === node.id}
              dim={dim}
              onHover={onHover}
              onSelect={onSelect}
            />
          );
        })}
    </>
  );
}

export default function NetworkMap3D({
  selectedId,
  onSelect,
  layers,
  statusFilter,
  focusId,
  focusToken,
  command,
  flow,
  grid,
}) {
  const host = useRef(null);
  const controlsRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [tip, setTip] = useState(null);
  const [theme] = useTheme();
  const palette = theme === "light"
    ? {
        bg: "#e8eef8",
        ground: "#f4f7fc",
        hemiSky: "#c9d7ff",
        hemiGround: "#d7deea",
        keyLight: "#ffffff",
        fillLight: "#8ea4ff",
        gridCell: "#c5d0e0",
        gridSection: "#9aa8c4",
        ambient: 0.55,
      }
    : {
        bg: "#07101c",
        ground: "#08111d",
        hemiSky: "#9bb4ff",
        hemiGround: "#0a121c",
        keyLight: "#d7e4ff",
        fillLight: "#6d7cff",
        gridCell: "#17324f",
        gridSection: "#35557a",
        ambient: 0.32,
      };

  const handleHover = (item, event) => {
    if (!item) {
      setHoveredId(null);
      setTip(null);
      return;
    }
    setHoveredId(item.id);
    const rect = host.current?.getBoundingClientRect();
    if (!rect || !event) return;
    const label = item.from
      ? `${item.id}  ${item.from} → ${item.to}  ${item.status}`
      : `${item.name || item.id} · ${item.status}`;
    setTip({ x: event.clientX - rect.left + 12, y: event.clientY - rect.top + 10, text: label });
  };

  return (
    <div className="map-canvas map-3d" ref={host}>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: DEFAULT_CAMERA_POS, fov: 42, near: 1, far: 5000 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ camera }) => {
          camera.lookAt(NETWORK_CENTER[0], NETWORK_CENTER[1], NETWORK_CENTER[2]);
        }}
        onPointerMissed={() => onSelect?.(null)}
      >
        <Scene
          selectedId={selectedId}
          hoveredId={hoveredId}
          layers={layers}
          statusFilter={statusFilter}
          flow={flow}
          grid={grid}
          onSelect={onSelect}
          onHover={handleHover}
          command={command}
          focusId={focusId}
          focusToken={focusToken}
          controlsRef={controlsRef}
          palette={palette}
        />
      </Canvas>
      {tip && (
        <div className="map-tooltip" style={{ left: tip.x, top: tip.y }}>
          {tip.text}
        </div>
      )}
    </div>
  );
}
