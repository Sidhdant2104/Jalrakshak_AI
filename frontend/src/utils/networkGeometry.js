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
