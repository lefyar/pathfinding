import { ChevronDown, Eraser, Play, RotateCcw, Sparkles } from "lucide-react";
import { speedLabels, type SpeedKey } from "../animation";
import type { AlgorithmKey } from "../types";
import { algorithmLabels } from "../algorithms";

type ControlPanelProps = {
  algorithm: AlgorithmKey;
  speed: SpeedKey;
  isVisualizing: boolean;
  onAlgorithmChange: (algorithm: AlgorithmKey) => void;
  onSpeedChange: (speed: SpeedKey) => void;
  onStart: () => void;
  onClearPath: () => void;
  onClearWalls: () => void;
  onGenerateMaze: () => void;
};

export function ControlPanel({
  algorithm,
  speed,
  isVisualizing,
  onAlgorithmChange,
  onSpeedChange,
  onStart,
  onClearPath,
  onClearWalls,
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
        <button type="button" disabled={isVisualizing} onClick={onClearPath} title="Clear path">
          <RotateCcw size={18} aria-hidden="true" />
          <span>Clear path</span>
        </button>
        <button type="button" disabled={isVisualizing} onClick={onClearWalls} title="Clear walls">
          <Eraser size={18} aria-hidden="true" />
          <span>Clear walls</span>
        </button>
        <button type="button" disabled={isVisualizing} onClick={onGenerateMaze} title="Generate random maze">
          <Sparkles size={18} aria-hidden="true" />
          <span>Random maze</span>
        </button>
      </div>
    </section>
  );
}
