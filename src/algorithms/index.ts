import type { AlgorithmKey, Grid, Position, SearchResult } from "../types";
import { astar } from "./astar";
import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";

export const algorithmLabels: Record<AlgorithmKey, string> = {
  dijkstra: "Dijkstra",
  astar: "A* Search",
  bfs: "Breadth-First Search",
  dfs: "Depth-First Search",
};

export const runAlgorithm = (
  algorithm: AlgorithmKey,
  grid: Grid,
  start: Position,
  target: Position,
): SearchResult => {
  switch (algorithm) {
    case "dijkstra":
      return dijkstra(grid, start, target);
    case "astar":
      return astar(grid, start, target);
    case "bfs":
      return bfs(grid, start, target);
    case "dfs":
      return dfs(grid, start, target);
  }
};
