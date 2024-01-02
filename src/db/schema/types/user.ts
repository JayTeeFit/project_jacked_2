export const premiumnessConfigEnum = ["free", "personal", "coach"] as const;
export type Premiumness = (typeof premiumnessConfigEnum)[number];
