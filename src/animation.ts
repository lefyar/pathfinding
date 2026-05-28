export type SpeedKey = "slow" | "normal" | "fast";

export const speedLabels: Record<SpeedKey, string> = {
  slow: "Slow",
  normal: "Normal",
  fast: "Fast",
};

export const speedDelays: Record<SpeedKey, number> = {
  slow: 65,
  normal: 28,
  fast: 8,
};
