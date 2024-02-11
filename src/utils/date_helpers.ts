export enum DateErrors {
  INVALID_DATE_STRING = "INVALID_DATE_STRING",
  INVALID_DATE = "INVALID_DATE",
}

export const isDateString = (dateString: string): boolean => {
  // Regular expression for ISO 8601 date format
  // YYYY-MM-DD
  const isoDateRegex =
    /^(?:\d{4})-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:0[1-9])|(?:1\d)|(?:2[0-9])|(?:3[0-1]))$/;
  return isoDateRegex.test(dateString);
};

export const isValidDateObject = (date: Date): boolean => {
  return !isNaN(date.getTime());
};

export const toDateString = (date: Date): string => {
  if (!isValidDateObject(date)) {
    return DateErrors.INVALID_DATE;
  }
  return date.toISOString().split("T")[0];
};
