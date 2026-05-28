import type { Grid, Position, SearchResult } from "../types";
import { nodeId, samePosition } from "../grid/grid";
import { getNeighbors, reconstructPath } from "./utils";

export const bfs = (grid: Grid, start: Position, target: Position): SearchResult => {
  const startedAt = performance.now();
  const queue: Position[] = [start];
  const visited = new Set<string>([nodeId(start)]);
  const previous = new Map<string, Position>();
  const visitedOrder: Position[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    visitedOrder.push(current);
    if (samePosition(current, target)) break;

    for (const neighbor of getNeighbors(grid, current)) {
      const key = nodeId(neighbor);
      if (visited.has(key)) continue;

      visited.add(key);
      previous.set(key, current);
      queue.push(neighbor);
    }
  }

  return {
    visitedOrder,
    path: reconstructPath(previous, start, target),
    executionTime: performance.now() - startedAt,
  };
};
