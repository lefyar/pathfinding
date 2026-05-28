import type { Grid, Position, SearchResult } from "../types";
import { nodeId, samePosition } from "../grid/grid";
import { getNeighbors, reconstructPath } from "./utils";

export const dfs = (grid: Grid, start: Position, target: Position): SearchResult => {
  const startedAt = performance.now();
  const stack: Position[] = [start];
  const visited = new Set<string>();
  const previous = new Map<string, Position>();
  const visitedOrder: Position[] = [];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) break;

    const currentKey = nodeId(current);
    if (visited.has(currentKey)) continue;

    visited.add(currentKey);
    visitedOrder.push(current);
    if (samePosition(current, target)) break;

    const neighbors = getNeighbors(grid, current).reverse();
    for (const neighbor of neighbors) {
      const key = nodeId(neighbor);
      if (visited.has(key)) continue;

      if (!previous.has(key)) previous.set(key, current);
      stack.push(neighbor);
    }
  }

  return {
    visitedOrder,
    path: reconstructPath(previous, start, target),
    executionTime: performance.now() - startedAt,
  };
};
