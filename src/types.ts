export type AlgorithmKey = "dijkstra" | "astar" | "bfs" | "dfs";

export type NodeKind = "empty" | "wall" | "start" | "target";

export type NodeVisualState = "idle" | "visited" | "path";

export type Position = {
  row: number;
  col: number;
};

export type GridNode = Position & {
  id: string;
  kind: NodeKind;
  visualState: NodeVisualState;
};

export type Grid = GridNode[][];

export type SearchResult = {
  visitedOrder: Position[];
  path: Position[];
  executionTime: number;
};

export type SearchStats = {
  visitedNodes: number;
  pathLength: number;
  executionTime: number;
};
