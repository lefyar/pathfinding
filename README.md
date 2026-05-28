# Pathfinding Visualizer

A modern educational pathfinding visualizer built with React, TypeScript, and Vite.

The app lets you draw walls, move the start and target nodes, generate a random maze, and compare how classic graph-search algorithms explore the same grid.

## Features

- Interactive 20 x 30 grid
- Drag to add or remove walls
- Paint weighted terrain for Dijkstra and A*
- Moveable start and target nodes
- Animated traversal and final path rendering
- Step-by-step mode for classroom-style inspection
- Dijkstra, A*, BFS, and DFS implementations
- Visualization speed controls
- Clear path, clear walls, clear weights, and recursive division maze actions
- Run statistics for visited nodes, path length, and execution time
- Dark minimalist UI with responsive mobile layout

## Algorithms

Algorithm implementations live in `src/algorithms`:

- Dijkstra's shortest path algorithm
- A* search with Manhattan-distance heuristic
- Breadth-First Search
- Depth-First Search

Dijkstra and A* account for weighted terrain. BFS and DFS intentionally ignore weights so learners can compare unweighted and weighted search behavior.

Grid state and interaction helpers live in `src/grid`.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Credits

Inspired by Dijkstra's shortest path algorithm and the A* search algorithm by Hart, Nilsson, and Raphael.

- Dijkstra paper: https://doi.org/10.1007/BF01386390
- A* paper: https://doi.org/10.1109/TSSC.1968.300136
