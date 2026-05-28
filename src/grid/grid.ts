import type { Grid, GridNode, NodeKind, Position } from "../types";

export const ROW_COUNT = 20;
export const COL_COUNT = 30;

export const DEFAULT_START: Position = { row: 10, col: 6 };
export const DEFAULT_TARGET: Position = { row: 10, col: 23 };

export const samePosition = (a: Position, b: Position) =>
  a.row === b.row && a.col === b.col;

export const nodeId = ({ row, col }: Position) => `${row}-${col}`;

const getKind = (position: Position, start: Position, target: Position): NodeKind => {
  if (samePosition(position, start)) return "start";
  if (samePosition(position, target)) return "target";
  return "empty";
};

export const createGrid = (
  rows = ROW_COUNT,
  cols = COL_COUNT,
  start = DEFAULT_START,
  target = DEFAULT_TARGET,
): Grid =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      id: nodeId({ row, col }),
      kind: getKind({ row, col }, start, target),
      visualState: "idle",
    })),
  );

export const cloneGrid = (grid: Grid): Grid =>
  grid.map((row) => row.map((node) => ({ ...node })));

export const clearPathStates = (grid: Grid): Grid =>
  grid.map((row) =>
    row.map((node) => ({
      ...node,
      visualState: "idle",
    })),
  );

export const clearWalls = (grid: Grid): Grid =>
  clearPathStates(grid).map((row) =>
    row.map((node) => ({
      ...node,
      kind: node.kind === "wall" ? "empty" : node.kind,
    })),
  );

export const setNodeVisualState = (
  grid: Grid,
  position: Position,
  visualState: GridNode["visualState"],
): Grid =>
  grid.map((row) =>
    row.map((node) =>
      samePosition(node, position) && node.kind !== "start" && node.kind !== "target"
        ? { ...node, visualState }
        : node,
    ),
  );

export const setWall = (grid: Grid, position: Position, shouldBeWall: boolean): Grid =>
  clearPathStates(grid).map((row) =>
    row.map((node) => {
      if (!samePosition(node, position) || node.kind === "start" || node.kind === "target") {
        return node;
      }

      return { ...node, kind: shouldBeWall ? "wall" : "empty" };
    }),
  );

export const moveSpecialNode = (
  grid: Grid,
  from: Position,
  to: Position,
  kind: Extract<NodeKind, "start" | "target">,
): Grid => {
  const destination = grid[to.row]?.[to.col];

  if (!destination || destination.kind === "wall" || destination.kind === kind) {
    return grid;
  }

  return clearPathStates(grid).map((row) =>
    row.map((node) => {
      if (samePosition(node, from)) return { ...node, kind: "empty" };
      if (samePosition(node, to)) return { ...node, kind };
      return node;
    }),
  );
};

export const generateRandomMaze = (
  grid: Grid,
  start: Position,
  target: Position,
  density = 0.28,
): Grid =>
  clearPathStates(grid).map((row) =>
    row.map((node) => {
      if (samePosition(node, start)) return { ...node, kind: "start" };
      if (samePosition(node, target)) return { ...node, kind: "target" };
      return { ...node, kind: Math.random() < density ? "wall" : "empty" };
    }),
  );

export const findNodeByKind = (
  grid: Grid,
  kind: Extract<NodeKind, "start" | "target">,
): Position => {
  for (const row of grid) {
    const node = row.find((cell) => cell.kind === kind);
    if (node) return { row: node.row, col: node.col };
  }

  throw new Error(`Grid does not contain a ${kind} node.`);
};
