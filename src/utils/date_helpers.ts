export enum DateErrors {
  INVALID_DATE_STRING = "INVALID_DATE_STRING",
}

export const isDateString = (dateString: string): boolean => {
  // Regular expression for ISO 8601 date format
  // YYYY-MM-DD
  const isoDateRegex =
    /^(?:\d{4})-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:0[1-9])|(?:1\d)|(?:2[0-9])|(?:3[0-1]))$/;
  return isoDateRegex.test(dateString);
};
