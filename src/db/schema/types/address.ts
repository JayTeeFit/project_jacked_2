export const addressTypeConfigEnum = [
  "profile",
  "shipping",
  "billing",
] as const;
export type AddressType = (typeof addressTypeConfigEnum)[number];
