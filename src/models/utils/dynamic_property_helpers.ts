import { DataType } from "src/db/schema/types/dynamic_properties";

export function validateValueInput(value: string, dataType: DataType) {
  const errorMessageStart = `Property value failed validation: `;
  const errorMessageKnownType = `Not a ${dataType}: propertyName: ${name}, value: ${value}`;
  switch (dataType) {
    case "decimal":
      if (!parseFloat(value)) {
        throw new Error(errorMessageStart + errorMessageKnownType);
      }
      break;
    case "integer":
      if (!parseInt(value)) {
        throw new Error(errorMessageStart + errorMessageKnownType);
      }
      break;
    case "boolean":
      if (!(value === "false" || value === "true")) {
        throw new Error(errorMessageStart + errorMessageKnownType);
      }
      break;
    case "string":
      break;
    default:
      throw new Error(errorMessageStart + `Unknown dataType ${dataType}`);
  }
}

export function cleanValueInput(value: string | null, dataType: DataType) {
  if (!value) {
    return null;
  }
  switch (dataType) {
    case "decimal":
    case "integer":
    case "string":
      return value;
    case "boolean":
      return value.toLowerCase();
    default:
      throw new Error(`Unkown setProperty dataType: ${dataType}`);
  }
}

export function cleanAndValidateValueInput(
  value: string | null,
  dataType: DataType
): string | null {
  const newValue = cleanValueInput(value, dataType);

  if (!newValue) {
    return null;
  }

  validateValueInput(newValue, dataType);

  return newValue;
}
