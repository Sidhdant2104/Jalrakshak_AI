import { prototypeNetwork } from "../data/prototypeNetwork";
import {
  connectedPipelineIds,
  findNode,
  getVisualConnectionPoint,
  neighborNodeIds,
} from "./networkGeometry";

/** Schematic (x,y) → world (x, elevation, z). y maps to z. */
export function toWorld(x, y, elevation = 0) {
  return [x, elevation, y];
}

export const NETWORK_CENTER = [600, 0, 350];
export const DEFAULT_CAMERA_POS = [210, 540, 1080];
export const PIPE_Y = 14;
export const ZONE_TOP = 8;

export function highlightSet(id) {
  if (!id) return null;
  const node = findNode(prototypeNetwork.nodes, id);
  if (node) {
    return {
      nodes: neighborNodeIds(prototypeNetwork, id),
      pipes: new Set(connectedPipelineIds(prototypeNetwork, id)),
    };
  }
  const pipe = prototypeNetwork.pipelines.find((p) => p.id === id);
  if (pipe) return { nodes: new Set([pipe.from, pipe.to]), pipes: new Set([pipe.id]) };
  return { nodes: new Set([id]), pipes: new Set() };
}

export function isHot(highlight, kind, itemId) {
  if (!highlight) return true;
  if (kind === "pipe") return highlight.pipes.has(itemId);
  return highlight.nodes.has(itemId);
}

export function pipeEnds(pipeline) {
  const from = getVisualConnectionPoint(findNode(prototypeNetwork.nodes, pipeline.from));
  const to = getVisualConnectionPoint(findNode(prototypeNetwork.nodes, pipeline.to));
  return { from, to };
}
