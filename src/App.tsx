import { useRef, useState } from "react";
import { runAlgorithm } from "./algorithms";
import { speedDelays, type SpeedKey } from "./animation";
import { AlgorithmInsight } from "./components/AlgorithmInsight";
import { ControlPanel } from "./components/ControlPanel";
import { GridBoard } from "./components/GridBoard";
import { StatsBar } from "./components/StatsBar";
import {
  clearPathStates,
  clearWeights,
  clearWalls,
  createGrid,
  DEFAULT_START,
  DEFAULT_TARGET,
  findNodeByKind,
  generateRecursiveDivisionMaze,
  moveSpecialNode,
  setNodeVisualState,
  setWeight,
  setWall,
} from "./grid/grid";
import type { AlgorithmKey, GridNode, PaintTool, Position, SearchResult, SearchStats } from "./types";

type DragMode =
  | { type: "none" }
  | { type: "wall"; makeWall: boolean }
  | { type: "weight"; makeWeight: boolean }
  | { type: "move-start" }
  | { type: "move-target" };

type StepSearch = SearchResult & {
  visitedIndex: number;
  pathIndex: number;
  start: Position;
  target: Position;
};

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
  const [paintTool, setPaintTool] = useState<PaintTool>("wall");
  const [speed, setSpeed] = useState<SpeedKey>("normal");
  const [stats, setStats] = useState<SearchStats>(emptyStats);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [stepSearch, setStepSearch] = useState<StepSearch | null>(null);
  const dragMode = useRef<DragMode>({ type: "none" });
  const animationRun = useRef(0);

  const resetStats = () => {
    setStats(emptyStats);
    setStepSearch(null);
  };

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

    if (paintTool === "weight") {
      const makeWeight = node.weight === 1;
      dragMode.current = { type: "weight", makeWeight };
      setGrid((current) => setWeight(current, node, makeWeight));
      resetStats();
      return;
    }

    const makeWall = node.kind !== "wall";
    dragMode.current = { type: "wall", makeWall };
    setGrid((current) => setWall(current, node, makeWall));
    resetStats();
  };

  const handlePointerEnter = (node: GridNode) => {
    if (isVisualizing || dragMode.current.type === "none") return;

    if (dragMode.current.type === "wall") {
      setGrid((current) => setWall(current, node, dragMode.current.type === "wall" && dragMode.current.makeWall));
      resetStats();
      return;
    }

    if (dragMode.current.type === "weight") {
      setGrid((current) =>
        setWeight(current, node, dragMode.current.type === "weight" && dragMode.current.makeWeight),
      );
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
    setStepSearch(null);

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

  const createStepSearch = (): StepSearch => {
    const cleanGrid = clearPathStates(grid);
    setGrid(cleanGrid);
    const currentStart = findNodeByKind(cleanGrid, "start");
    const currentTarget = findNodeByKind(cleanGrid, "target");
    const result = runAlgorithm(algorithm, cleanGrid, currentStart, currentTarget);

    return {
      ...result,
      visitedIndex: 0,
      pathIndex: 0,
      start: currentStart,
      target: currentTarget,
    };
  };

  const handleStep = () => {
    const current = stepSearch ?? createStepSearch();

    if (current.visitedIndex < current.visitedOrder.length) {
      const node = current.visitedOrder[current.visitedIndex];
      const next = { ...current, visitedIndex: current.visitedIndex + 1 };
      setGrid((activeGrid) => setNodeVisualState(activeGrid, node, "visited"));
      setStats({
        visitedNodes: next.visitedIndex,
        pathLength: 0,
        executionTime: current.executionTime,
      });
      setStepSearch(next);
      return;
    }

    if (current.pathIndex < current.path.length) {
      const node = current.path[current.pathIndex];
      const next = { ...current, pathIndex: current.pathIndex + 1 };
      setGrid((activeGrid) => setNodeVisualState(activeGrid, node, "path"));
      setStats({
        visitedNodes: current.visitedOrder.length,
        pathLength: Math.max(0, next.pathIndex - 1),
        executionTime: current.executionTime,
      });
      setStepSearch(next);
      setStart(current.start);
      setTarget(current.target);
      return;
    }

    setStepSearch(null);
  };

  const handleClearWalls = () => {
    animationRun.current += 1;
    setIsVisualizing(false);
    setGrid((current) => clearWalls(current));
    resetStats();
  };

  const handleClearWeights = () => {
    animationRun.current += 1;
    setIsVisualizing(false);
    setGrid((current) => clearWeights(current));
    resetStats();
  };

  const handleGenerateMaze = () => {
    animationRun.current += 1;
    setIsVisualizing(false);
    setGrid((current) => generateRecursiveDivisionMaze(current, start, target));
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
        <div className="controls-column">
          <ControlPanel
            algorithm={algorithm}
            paintTool={paintTool}
            speed={speed}
            isVisualizing={isVisualizing}
            onAlgorithmChange={setAlgorithm}
            onPaintToolChange={setPaintTool}
            onSpeedChange={setSpeed}
            onStart={animateSearch}
            onStep={handleStep}
            onClearPath={stopAnimationAndClearPath}
            onClearWalls={handleClearWalls}
            onClearWeights={handleClearWeights}
            onGenerateMaze={handleGenerateMaze}
          />
        </div>

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
              <span className="legend-item weight-key">Weight</span>
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

        <aside className="info-column" aria-label="Pathfinding run details">
          <StatsBar stats={stats} />

          <AlgorithmInsight algorithm={algorithm} />
        </aside>
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
