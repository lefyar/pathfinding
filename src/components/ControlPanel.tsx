import { ChevronDown, Eraser, Footprints, Play, RotateCcw, Sparkles } from "lucide-react";
import { speedLabels, type SpeedKey } from "../animation";
import type { AlgorithmKey, PaintTool } from "../types";
import { algorithmLabels } from "../algorithms";

type ControlPanelProps = {
  algorithm: AlgorithmKey;
  paintTool: PaintTool;
  speed: SpeedKey;
  isVisualizing: boolean;
  onAlgorithmChange: (algorithm: AlgorithmKey) => void;
  onPaintToolChange: (tool: PaintTool) => void;
  onSpeedChange: (speed: SpeedKey) => void;
  onStart: () => void;
  onStep: () => void;
  onClearPath: () => void;
  onClearWalls: () => void;
  onClearWeights: () => void;
  onGenerateMaze: () => void;
};

export function ControlPanel({
  algorithm,
  paintTool,
  speed,
  isVisualizing,
  onAlgorithmChange,
  onPaintToolChange,
  onSpeedChange,
  onStart,
  onStep,
  onClearPath,
  onClearWalls,
  onClearWeights,
  onGenerateMaze,
}: ControlPanelProps) {
  return (
    <section className="control-panel" aria-label="Pathfinding controls">
      <div className="panel-heading">
        <span>Experiment</span>
        <strong>{isVisualizing ? "Visualizing" : "Ready"}</strong>
      </div>

      <label className="field">
        <span>Algorithm</span>
        <span className="select-shell">
          <select
            value={algorithm}
            disabled={isVisualizing}
            onChange={(event) => onAlgorithmChange(event.target.value as AlgorithmKey)}
          >
            {Object.entries(algorithmLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </span>
      </label>

      <label className="field">
        <span>Paint tool</span>
        <span className="segmented-control">
          <button
            className={paintTool === "wall" ? "active" : ""}
            type="button"
            disabled={isVisualizing}
            onClick={() => onPaintToolChange("wall")}
          >
            Wall
          </button>
          <button
            className={paintTool === "weight" ? "active" : ""}
            type="button"
            disabled={isVisualizing}
            onClick={() => onPaintToolChange("weight")}
          >
            Weight
          </button>
        </span>
      </label>

      <label className="field">
        <span>Speed</span>
        <span className="select-shell">
          <select
            value={speed}
            disabled={isVisualizing}
            onChange={(event) => onSpeedChange(event.target.value as SpeedKey)}
          >
            {Object.entries(speedLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </span>
      </label>

      <div className="button-row">
        <button className="primary-button" type="button" disabled={isVisualizing} onClick={onStart} title="Start visualization">
          <Play size={18} aria-hidden="true" />
          <span>Start</span>
        </button>
        <button type="button" disabled={isVisualizing} onClick={onStep} title="Step through the visualization">
          <Footprints size={18} aria-hidden="true" />
          <span>Step</span>
        </button>
        <button type="button" disabled={isVisualizing} onClick={onClearPath} title="Clear path">
          <RotateCcw size={18} aria-hidden="true" />
          <span>Clear path</span>
        </button>
        <button type="button" disabled={isVisualizing} onClick={onClearWalls} title="Clear walls">
          <Eraser size={18} aria-hidden="true" />
          <span>Clear walls</span>
        </button>
        <button type="button" disabled={isVisualizing} onClick={onClearWeights} title="Clear weighted nodes">
          <Eraser size={18} aria-hidden="true" />
          <span>Clear weights</span>
        </button>
        <button type="button" disabled={isVisualizing} onClick={onGenerateMaze} title="Generate recursive division maze">
          <Sparkles size={18} aria-hidden="true" />
          <span>Maze</span>
        </button>
      </div>
    </section>
  );
}
