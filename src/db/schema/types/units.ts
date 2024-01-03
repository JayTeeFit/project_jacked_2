export const weightUnitsEnum = ["lbs", "kgs"] as const;
export type WeightUnit = (typeof weightUnitsEnum)[number];

export const exertionUnitsEnum = ["RPE", "RIR", "AMRAP", "% 1RM"] as const;
export type ExertionUnit = (typeof exertionUnitsEnum)[number];
