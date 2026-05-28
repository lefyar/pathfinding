import type { Grid, Position, SearchResult } from "../types";
import { nodeId, samePosition } from "../grid/grid";
import { getNeighbors, getNodeCost, manhattanDistance, reconstructPath } from "./utils";

export const astar = (grid: Grid, start: Position, target: Position): SearchResult => {
  const startedAt = performance.now();
  const openSet: Position[] = [start];
  const openKeys = new Set<string>([nodeId(start)]);
  const closedKeys = new Set<string>();
  const previous = new Map<string, Position>();
  const gScore = new Map<string, number>([[nodeId(start), 0]]);
  const fScore = new Map<string, number>([[nodeId(start), manhattanDistance(start, target)]]);
  const visitedOrder: Position[] = [];

  while (openSet.length > 0) {
    openSet.sort((a, b) => (fScore.get(nodeId(a)) ?? Infinity) - (fScore.get(nodeId(b)) ?? Infinity));
    const current = openSet.shift();
    if (!current) break;

    const currentKey = nodeId(current);
    openKeys.delete(currentKey);
    if (closedKeys.has(currentKey)) continue;

    closedKeys.add(currentKey);
    visitedOrder.push(current);
    if (samePosition(current, target)) break;

    for (const neighbor of getNeighbors(grid, current)) {
      const neighborKey = nodeId(neighbor);
      if (closedKeys.has(neighborKey)) continue;

      const tentativeGScore = (gScore.get(currentKey) ?? Infinity) + getNodeCost(grid, neighbor);
      if (tentativeGScore >= (gScore.get(neighborKey) ?? Infinity)) continue;

      previous.set(neighborKey, current);
      gScore.set(neighborKey, tentativeGScore);
      fScore.set(neighborKey, tentativeGScore + manhattanDistance(neighbor, target));

      if (!openKeys.has(neighborKey)) {
        openSet.push(neighbor);
        openKeys.add(neighborKey);
      }
    }
  }

  return {
    visitedOrder,
    path: reconstructPath(previous, start, target),
    executionTime: performance.now() - startedAt,
  };
};
