export const allowedPropertiesForSets = [
  "expExertion",
  "expExertionUnits",
  "expWeight",
  "expWeightUnits",
  "expReps",
] as const;
export type PropertyForSetName = (typeof allowedPropertiesForSets)[number];
