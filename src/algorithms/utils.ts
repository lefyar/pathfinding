import type { Grid, Position } from "../types";
import { nodeId, samePosition } from "../grid/grid";

export const getNeighbors = (grid: Grid, position: Position): Position[] => {
  const directions = [
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
  ];

  return directions
    .map((direction) => ({
      row: position.row + direction.row,
      col: position.col + direction.col,
    }))
    .filter((neighbor) => {
      const node = grid[neighbor.row]?.[neighbor.col];
      return Boolean(node && node.kind !== "wall");
    });
};

export const getNodeCost = (grid: Grid, position: Position) =>
  grid[position.row]?.[position.col]?.weight ?? 1;

export const reconstructPath = (
  previous: Map<string, Position>,
  start: Position,
  target: Position,
): Position[] => {
  if (samePosition(start, target)) return [start];

  const path: Position[] = [];
  let current: Position | undefined = target;

  while (current) {
    path.unshift(current);
    if (samePosition(current, start)) return path;
    current = previous.get(nodeId(current));
  }

  return [];
};

export const manhattanDistance = (a: Position, b: Position) =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
