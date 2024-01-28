export const dataTypesEnum = [
  "string",
  "integer",
  "boolean",
  "decimal",
] as const;
export type DataType = (typeof dataTypesEnum)[number];

export interface DynamicPropertiesSchema {
  id: number;
  name: string;
  dataType: DataType;
}
