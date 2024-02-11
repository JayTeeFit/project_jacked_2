import {
  DateErrors,
  isDateString,
  isValidDateObject,
  toDateString,
} from "src/utils/date_helpers";

suite("DateHelpers", () => {
  suite("toDateString", () => {
    test("converts date to string", () => {
      const date = new Date("2021-12-12");
      const dateString = toDateString(date);

      expect(dateString).toBe("2021-12-12");
    });

    test("handles invalid date gracefully", () => {
      const date = new Date("abc");
      const dateString = toDateString(date);

      expect(dateString).toBe(DateErrors.INVALID_DATE);
    });
  });

  suite("isDateString", () => {
    test("validates date string", () => {
      const validDateString = "2021-12-12";
      const isValid = isDateString(validDateString);

      expect(isValid).toBe(true);
    });

    test("invalidates date string", () => {
      const invalidDateString = "20-12-1988";
      const isValid = isDateString(invalidDateString);

      expect(isValid).toBe(false);
    });

    test("invalidates date string day", () => {
      const invalidDateString = "2021-12-32";
      const isValid = isDateString(invalidDateString);

      expect(isValid).toBe(false);
    });

    test("invalidates date string month", () => {
      const invalidDateString = "2021-13-12";
      const isValid = isDateString(invalidDateString);

      expect(isValid).toBe(false);
    });
  });

  suite("isValidDateObject", () => {
    test("validates date", () => {
      const validDate = new Date("2021-12-12");
      const isValid = isValidDateObject(validDate);

      expect(isValid).toBe(true);
    });

    test("invalidates date", () => {
      const invalidDate = new Date("abc");
      const isValid = isValidDateObject(invalidDate);

      expect(isValid).toBe(false);
    });
  });
});
