import type { AlgorithmKey } from "../types";

type AlgorithmInsightProps = {
  algorithm: AlgorithmKey;
};

const insights: Record<
  AlgorithmKey,
  {
    label: string;
    summary: string;
    traits: string[];
  }
> = {
  dijkstra: {
    label: "Dijkstra",
    summary:
      "Expands the lowest known-cost frontier first. Weighted cells cost more, so it can route around expensive terrain even when the path has more steps.",
    traits: ["Shortest path", "Non-negative weights", "Systematic frontier"],
  },
  astar: {
    label: "A* Search",
    summary:
      "Combines known travel cost with a Manhattan-distance estimate, so it usually focuses exploration toward the target.",
    traits: ["Shortest path", "Uses heuristic", "Goal-directed"],
  },
  bfs: {
    label: "Breadth-First Search",
    summary:
      "Visits cells in waves from the start node. It finds the fewest steps in an unweighted grid, but it ignores weighted terrain costs.",
    traits: ["Fewest steps", "Ignores weights", "Layer by layer"],
  },
  dfs: {
    label: "Depth-First Search",
    summary:
      "Follows one branch deeply before backtracking. It is useful for exploration, but it does not guarantee the shortest path.",
    traits: ["Not shortest", "Low memory idea", "Branch-first"],
  },
};

export function AlgorithmInsight({ algorithm }: AlgorithmInsightProps) {
  const insight = insights[algorithm];

  return (
    <section className="insight-panel" aria-label="Algorithm insight">
      <div className="panel-heading">
        <span>Current model</span>
        <strong>{insight.label}</strong>
      </div>
      <p>{insight.summary}</p>
      <div className="trait-list">
        {insight.traits.map((trait) => (
          <span key={trait}>{trait}</span>
        ))}
      </div>
    </section>
  );
}
