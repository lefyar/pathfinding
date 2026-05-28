import { useRef, useState } from "react";
import { runAlgorithm } from "./algorithms";
import { speedDelays, type SpeedKey } from "./animation";
import { AlgorithmInsight } from "./components/AlgorithmInsight";
import { ControlPanel } from "./components/ControlPanel";
import { GridBoard } from "./components/GridBoard";
import { StatsBar } from "./components/StatsBar";
import {
  clearPathStates,
  clearWalls,
  createGrid,
  DEFAULT_START,
  DEFAULT_TARGET,
  findNodeByKind,
  generateRandomMaze,
  moveSpecialNode,
  setNodeVisualState,
  setWall,
} from "./grid/grid";
import type { AlgorithmKey, GridNode, Position, SearchStats } from "./types";

type DragMode =
  | { type: "none" }
  | { type: "wall"; makeWall: boolean }
  | { type: "move-start" }
  | { type: "move-target" };

const emptyStats: SearchStats = {
  visitedNodes: 0,
  pathLength: 0,
  executionTime: 0,
};

const pause = (milliseconds: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

export default function App() {
  const [grid, setGrid] = useState(() => createGrid());
  const [start, setStart] = useState<Position>(DEFAULT_START);
  const [target, setTarget] = useState<Position>(DEFAULT_TARGET);
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>("dijkstra");
  const [speed, setSpeed] = useState<SpeedKey>("normal");
  const [stats, setStats] = useState<SearchStats>(emptyStats);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const dragMode = useRef<DragMode>({ type: "none" });
  const animationRun = useRef(0);

  const resetStats = () => setStats(emptyStats);

  const stopAnimationAndClearPath = () => {
    animationRun.current += 1;
    setIsVisualizing(false);
    setGrid((current) => clearPathStates(current));
    resetStats();
  };

  const handlePointerDown = (node: GridNode) => {
    if (isVisualizing) return;

    if (node.kind === "start") {
      dragMode.current = { type: "move-start" };
      return;
    }

    if (node.kind === "target") {
      dragMode.current = { type: "move-target" };
      return;
    }

    const makeWall = node.kind !== "wall";
    dragMode.current = { type: "wall", makeWall };
    setGrid((current) => setWall(current, node, makeWall));
  };

  const handlePointerEnter = (node: GridNode) => {
    if (isVisualizing || dragMode.current.type === "none") return;

    if (dragMode.current.type === "wall") {
      setGrid((current) => setWall(current, node, dragMode.current.type === "wall" && dragMode.current.makeWall));
      resetStats();
      return;
    }

    if (dragMode.current.type === "move-start" && node.kind !== "target") {
      setGrid((current) => moveSpecialNode(current, start, node, "start"));
      setStart({ row: node.row, col: node.col });
      resetStats();
      return;
    }

    if (dragMode.current.type === "move-target" && node.kind !== "start") {
      setGrid((current) => moveSpecialNode(current, target, node, "target"));
      setTarget({ row: node.row, col: node.col });
      resetStats();
    }
  };

  const handlePointerUp = () => {
    dragMode.current = { type: "none" };
  };

  const animateSearch = async () => {
    const runId = animationRun.current + 1;
    animationRun.current = runId;
    dragMode.current = { type: "none" };
    setIsVisualizing(true);

    const cleanGrid = clearPathStates(grid);
    setGrid(cleanGrid);
    const currentStart = findNodeByKind(cleanGrid, "start");
    const currentTarget = findNodeByKind(cleanGrid, "target");
    const result = runAlgorithm(algorithm, cleanGrid, currentStart, currentTarget);
    const delay = speedDelays[speed];

    for (const node of result.visitedOrder) {
      if (animationRun.current !== runId) return;
      setGrid((current) => setNodeVisualState(current, node, "visited"));
      await pause(delay);
    }

    for (const node of result.path) {
      if (animationRun.current !== runId) return;
      setGrid((current) => setNodeVisualState(current, node, "path"));
      await pause(Math.max(12, delay * 1.6));
    }

    setStats({
      visitedNodes: result.visitedOrder.length,
      pathLength: Math.max(0, result.path.length - 1),
      executionTime: result.executionTime,
    });
    setStart(currentStart);
    setTarget(currentTarget);
    setIsVisualizing(false);
  };

  const handleClearWalls = () => {
    animationRun.current += 1;
    setIsVisualizing(false);
    setGrid((current) => clearWalls(current));
    resetStats();
  };

  const handleGenerateMaze = () => {
    animationRun.current += 1;
    setIsVisualizing(false);
    setGrid((current) => generateRandomMaze(current, start, target));
    resetStats();
  };

  return (
    <main className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Educational algorithm visualization</p>
          <h1>Pathfinding Visualizer</h1>
          <p>
            A focused graph-search lab for comparing frontier expansion,
            shortest paths, and heuristic search on the same grid.
          </p>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Pathfinding workspace controls">
          <ControlPanel
            algorithm={algorithm}
            speed={speed}
            isVisualizing={isVisualizing}
            onAlgorithmChange={setAlgorithm}
            onSpeedChange={setSpeed}
            onStart={animateSearch}
            onClearPath={stopAnimationAndClearPath}
            onClearWalls={handleClearWalls}
            onGenerateMaze={handleGenerateMaze}
          />

          <StatsBar stats={stats} />

          <AlgorithmInsight algorithm={algorithm} />
        </aside>

        <section className="board-area">
          <div className="board-header">
            <div>
              <span className="board-kicker">20 x 30 grid</span>
              <h2>Search space</h2>
            </div>
            <div className="legend" aria-label="Node legend">
              <span className="legend-item start-key">Start</span>
              <span className="legend-item target-key">Target</span>
              <span className="legend-item wall-key">Wall</span>
              <span className="legend-item visited-key">Visited</span>
              <span className="legend-item path-key">Path</span>
            </div>
          </div>

          <GridBoard
            grid={grid}
            isVisualizing={isVisualizing}
            onPointerDown={handlePointerDown}
            onPointerEnter={handlePointerEnter}
            onPointerUp={handlePointerUp}
          />
        </section>
      </div>

      <footer>
        Based on{" "}
        <a href="https://doi.org/10.1007/BF01386390" target="_blank" rel="noreferrer">
          Dijkstra's shortest path algorithm
        </a>{" "}
        and the{" "}
        <a href="https://doi.org/10.1109/TSSC.1968.300136" target="_blank" rel="noreferrer">
          A* search algorithm by Hart, Nilsson, and Raphael
        </a>
        .
        <a className="creator-credit" href="https://www.lefyar.dev/" target="_blank" rel="noreferrer">
          Lefyar
        </a>
      </footer>
    </main>
  );
}
