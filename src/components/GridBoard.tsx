import type { Grid, GridNode } from "../types";

type GridBoardProps = {
  grid: Grid;
  isVisualizing: boolean;
  onPointerDown: (node: GridNode) => void;
  onPointerEnter: (node: GridNode) => void;
  onPointerUp: () => void;
};

export function GridBoard({
  grid,
  isVisualizing,
  onPointerDown,
  onPointerEnter,
  onPointerUp,
}: GridBoardProps) {
  return (
    <section className="grid-shell" aria-label="Interactive pathfinding grid">
      <div
        className="grid-board"
        style={{
          gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${grid[0]?.length ?? 0}, minmax(0, 1fr))`,
        }}
        onPointerLeave={onPointerUp}
        onPointerUp={onPointerUp}
      >
        {grid.flat().map((node) => (
          <button
            key={node.id}
            type="button"
            disabled={isVisualizing}
            className={`grid-node ${node.kind} ${node.weight > 1 ? "weighted" : ""} ${node.visualState}`}
            aria-label={`${node.kind} node at row ${node.row + 1}, column ${node.col + 1}`}
            onPointerDown={() => onPointerDown(node)}
            onPointerEnter={() => onPointerEnter(node)}
          />
        ))}
      </div>
    </section>
  );
}
