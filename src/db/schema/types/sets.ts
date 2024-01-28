export const allowedPropertiesForSets = [
  "expExertion",
  "expExertionUpper",
  "expExertionLower",
  "expExertionUnits",
  "expWeight",
  "expWeightUpper",
  "expWeightLower",
  "expWeightUnits",
  "expReps",
  "expRepsUpper",
  "expRepsLower",
] as const;
export type PropertyForSetName = (typeof allowedPropertiesForSets)[number];
