import { Activity, Footprints, Timer } from "lucide-react";
import type { SearchStats } from "../types";

type StatsBarProps = {
  stats: SearchStats;
};

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <section className="stats-bar" aria-label="Visualization statistics">
      <div className="panel-heading">
        <span>Run metrics</span>
        <strong>Live result</strong>
      </div>
      <div className="stat">
        <Activity size={18} aria-hidden="true" />
        <span>Visited</span>
        <strong>{stats.visitedNodes}</strong>
      </div>
      <div className="stat">
        <Footprints size={18} aria-hidden="true" />
        <span>Path length</span>
        <strong>{stats.pathLength}</strong>
      </div>
      <div className="stat">
        <Timer size={18} aria-hidden="true" />
        <span>Execution</span>
        <strong>{stats.executionTime.toFixed(2)} ms</strong>
      </div>
    </section>
  );
}
