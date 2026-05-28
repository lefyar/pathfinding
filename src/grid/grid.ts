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
      weight: 1,
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

export const clearWeights = (grid: Grid): Grid =>
  clearPathStates(grid).map((row) =>
    row.map((node) => ({
      ...node,
      weight: 1,
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

export const setWeight = (grid: Grid, position: Position, shouldBeWeighted: boolean): Grid =>
  clearPathStates(grid).map((row) =>
    row.map((node) => {
      if (!samePosition(node, position) || node.kind === "start" || node.kind === "target") {
        return node;
      }

      return {
        ...node,
        kind: node.kind === "wall" ? "empty" : node.kind,
        weight: shouldBeWeighted ? 5 : 1,
      };
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
      if (samePosition(node, from)) return { ...node, kind: "empty", weight: 1 };
      if (samePosition(node, to)) return { ...node, kind, weight: 1 };
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
      return { ...node, kind: Math.random() < density ? "wall" : "empty", weight: 1 };
    }),
  );

export const generateRecursiveDivisionMaze = (
  grid: Grid,
  start: Position,
  target: Position,
): Grid => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const walls = new Set<string>();

  const divide = (
    top: number,
    bottom: number,
    left: number,
    right: number,
    orientation: "horizontal" | "vertical",
  ) => {
    if (bottom - top < 2 || right - left < 2) return;

    if (orientation === "horizontal") {
      const possibleRows = [];
      for (let row = top + 1; row < bottom; row += 2) possibleRows.push(row);
      const wallRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
      const passageCols = [];
      for (let col = left; col <= right; col += 2) passageCols.push(col);
      const passageCol = passageCols[Math.floor(Math.random() * passageCols.length)];

      for (let col = left; col <= right; col += 1) {
        if (col !== passageCol) walls.add(nodeId({ row: wallRow, col }));
      }

      divide(top, wallRow - 1, left, right, "vertical");
      divide(wallRow + 1, bottom, left, right, "vertical");
      return;
    }

    const possibleCols = [];
    for (let col = left + 1; col < right; col += 2) possibleCols.push(col);
    const wallCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
    const passageRows = [];
    for (let row = top; row <= bottom; row += 2) passageRows.push(row);
    const passageRow = passageRows[Math.floor(Math.random() * passageRows.length)];

    for (let row = top; row <= bottom; row += 1) {
      if (row !== passageRow) walls.add(nodeId({ row, col: wallCol }));
    }

    divide(top, bottom, left, wallCol - 1, "horizontal");
    divide(top, bottom, wallCol + 1, right, "horizontal");
  };

  divide(0, rows - 1, 0, cols - 1, cols > rows ? "vertical" : "horizontal");

  return clearPathStates(grid).map((row) =>
    row.map((node) => {
      if (samePosition(node, start)) return { ...node, kind: "start", weight: 1 };
      if (samePosition(node, target)) return { ...node, kind: "target", weight: 1 };
      return { ...node, kind: walls.has(node.id) ? "wall" : "empty", weight: 1 };
    }),
  );
};

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
