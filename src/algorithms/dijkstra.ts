import type { Grid, Position, SearchResult } from "../types";
import { nodeId, samePosition } from "../grid/grid";
import { getNeighbors, getNodeCost, reconstructPath } from "./utils";

export const dijkstra = (grid: Grid, start: Position, target: Position): SearchResult => {
  const startedAt = performance.now();
  const distances = new Map<string, number>();
  const previous = new Map<string, Position>();
  const unvisited: Position[] = [];
  const visited = new Set<string>();
  const visitedOrder: Position[] = [];

  for (const row of grid) {
    for (const node of row) {
      if (node.kind !== "wall") {
        const position = { row: node.row, col: node.col };
        distances.set(node.id, samePosition(position, start) ? 0 : Number.POSITIVE_INFINITY);
        unvisited.push(position);
      }
    }
  }

  while (unvisited.length > 0) {
    unvisited.sort((a, b) => (distances.get(nodeId(a)) ?? Infinity) - (distances.get(nodeId(b)) ?? Infinity));
    const current = unvisited.shift();
    if (!current) break;

    const currentKey = nodeId(current);
    const currentDistance = distances.get(currentKey) ?? Infinity;
    if (currentDistance === Infinity) break;
    if (visited.has(currentKey)) continue;

    visited.add(currentKey);
    visitedOrder.push(current);
    if (samePosition(current, target)) break;

    for (const neighbor of getNeighbors(grid, current)) {
      const key = nodeId(neighbor);
      const distance = currentDistance + getNodeCost(grid, neighbor);

      if (distance < (distances.get(key) ?? Infinity)) {
        distances.set(key, distance);
        previous.set(key, current);
      }
    }
  }

  return {
    visitedOrder,
    path: reconstructPath(previous, start, target),
    executionTime: performance.now() - startedAt,
  };
};
