/** Visual helpers only. Never mutates prototypeNetwork coordinates. */

export function polygonCentroid(coordinates = []) {
  if (!coordinates.length) return null;
  const total = coordinates.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 }
  );
  return {
    x: total.x / coordinates.length,
    y: total.y / coordinates.length,
  };
}

export function getVisualConnectionPoint(node) {
  if (!node) return null;
  if (node.connectionPoint) return node.connectionPoint;
  if (node.position) return node.position;
  if (node.type === "ZONE" && node.geometry?.coordinates?.length) {
    return polygonCentroid(node.geometry.coordinates);
  }
  return null;
}

export function findNode(nodes, id) {
  return nodes.find((node) => node.id === id);
}

export function getEntityAnchor(network, id) {
  const node = findNode(network.nodes, id);
  if (node) return getVisualConnectionPoint(node);
  const pipe = network.pipelines.find((p) => p.id === id);
  if (!pipe) return null;
  const from = getVisualConnectionPoint(findNode(network.nodes, pipe.from));
  const to = getVisualConnectionPoint(findNode(network.nodes, pipe.to));
  if (!from || !to) return null;
  return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
}

export function connectedPipelineIds(network, nodeId) {
  return network.pipelines.filter((p) => p.from === nodeId || p.to === nodeId).map((p) => p.id);
}

export function neighborNodeIds(network, nodeId) {
  const ids = new Set([nodeId]);
  network.pipelines.forEach((p) => {
    if (p.from === nodeId) ids.add(p.to);
    if (p.to === nodeId) ids.add(p.from);
  });
  return ids;
}

export function viewAround(point, scale = 1) {
  const w = 520 * scale;
  const h = (520 * 700) / 1200 * scale;
  return {
    x: point.x - w / 2,
    y: point.y - h / 2,
    w,
    h,
  };
}

export const FIT_VIEW = { x: -16, y: -16, w: 1232, h: 732 };
export const BASE_VIEW = { x: 0, y: 0, w: 1200, h: 700 };
