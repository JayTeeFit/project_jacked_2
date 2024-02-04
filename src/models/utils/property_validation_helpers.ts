import { DataType } from "src/db/schema/types/dynamic_properties";

export type ValueValidationResponse = {
  value: string | null;
  error: Error | null;
};

export enum ValueValidationError {
  DATATYPE_DOESNT_SUPPORT_RANGE = "DataType doesn't support range",
  UNKNOWN_DATATYPE = "Unknown dataType",
}

export function validateValueInput<T>(
  value: string,
  dataType: DataType,
  propertyName: T,
  isRange = false
) {
  const errorMessageIsRange = isRange ? `range of ` : "";
  let errorMessage = `Property value validation failure: Not a ${errorMessageIsRange}${dataType}: propertyName: ${propertyName}, value: ${value}`;
  let isError = false;

  switch (dataType) {
    case "decimal":
      if (isRange) {
        isError = !isRangeValid(value, dataType);
      } else {
        isError = !parseFloat(value);
      }
      break;
    case "integer":
      if (isRange) {
        isError = !isRangeValid(value, dataType);
      } else {
        isError = !isInteger(value);
      }
      break;
    case "boolean":
      isError = !(value === "false" || value === "true");
      break;
    case "string":
      isError = typeof value !== "string";
      break;
    default:
      errorMessage = ValueValidationError.UNKNOWN_DATATYPE;
  }

  return isError ? new Error(errorMessage) : null;
}

export function isInteger(value: string) {
  if (!value) {
    return false;
  }
  const num = Number(value);
  return !isNaN(num) && Number.isInteger(num);
}

function isRangeValid(value: string, rangeType: "integer" | "decimal") {
  const rangeValues = value.split("-");
  if (rangeValues.length !== 2) {
    return false;
  }
  for (const value of rangeValues) {
    if (rangeType === "integer" ? !isInteger(value) : !parseFloat(value)) {
      return false;
    }
  }

  return true;
}

export function cleanValueInput(value: string, dataType: DataType) {
  value = value.trim();
  switch (dataType) {
    case "decimal":
    case "integer":
      return value
        .split("-")
        .map((entry) => entry.trim())
        .join("-");
    case "string":
      return value;
    case "boolean":
      return value.toLowerCase();
    default:
      return new Error(ValueValidationError.UNKNOWN_DATATYPE);
  }
}

function dataTypeSupportsRange(dataType: DataType) {
  const supportsRange = ["integer", "decimal"];
  return supportsRange.includes(dataType);
}

export function cleanAndValidateValueInput<T>(
  value: string,
  dataType: DataType,
  propertyName: T,
  isRange = false
): ValueValidationResponse {
  if (isRange && !dataTypeSupportsRange(dataType)) {
    return {
      value: null,
      error: new Error(ValueValidationError.DATATYPE_DOESNT_SUPPORT_RANGE),
    };
  }

  const newValue = cleanValueInput(value, dataType);

  if (newValue instanceof Error) {
    return { value: null, error: newValue };
  }

  const error = validateValueInput(newValue, dataType, propertyName, isRange);

  if (error) {
    return { value: null, error };
  }

  return { value: newValue, error: null };
}
