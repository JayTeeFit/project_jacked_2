import { DataType } from "src/db/schema/types/dynamic_properties";
import {
  cleanAndValidateValueInput,
  validateValueInput,
} from "src/models/utils/property_validation_helpers";

suite("ValidationHelpers", () => {
  suite("validateValueInput", () => {
    suite("returns null", () => {
      test("for valid integer", () => {
        const value = "8";
        const dataType = "integer";
        const propertyName = "expExertion";
        const result = validateValueInput(value, dataType, propertyName);
        expect(result).toBeNull();
      });

      test("for valid decimal", () => {
        const dataType = "decimal";
        const propertyName = "expWeight";

        let value = "1.5";
        let result = validateValueInput(value, dataType, propertyName);
        expect(result).toBeNull();

        value = "1";
        result = validateValueInput(value, dataType, propertyName);
        expect(result).toBeNull();
      });

      test("for valid boolean", () => {
        const dataType = "boolean";
        const propertyName = "expIsWarmup";

        let value = "true";
        let result = validateValueInput(value, dataType, propertyName);
        expect(result).toBeNull();

        value = "false";
        result = validateValueInput(value, dataType, propertyName);
        expect(result).toBeNull();
      });

      test("for valid string", () => {
        const dataType = "string";
        const propertyName = "expNotes";

        let value = "abc";
        let result = validateValueInput(value, dataType, propertyName);
        expect(result).toBeNull();

        value = "true";
        result = validateValueInput(value, dataType, propertyName);
        expect(result).toBeNull();
      });
    });

    suite("returns error", () => {
      test("for invalid integer", () => {
        const dataType = "integer";
        const propertyName = "expExertion";

        let value = "abc";
        let result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();

        value = "1.5";
        result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();

        value = "true";
        result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();
      });

      test("for invalid decimal", () => {
        const dataType = "decimal";
        const propertyName = "expWeight";

        let value = "abc";
        let result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();

        value = "true";
        result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();

        value = "4.a";
        result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();
      });

      test("for invalid boolean", () => {
        const dataType = "boolean";
        const propertyName = "expIsWarmup";

        let value = "abc";
        let result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();

        value = "1";
        result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();

        value = "True";
        result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();

        value = "False";
        result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();
      });

      test("for invalid string", () => {
        const dataType = "string";
        const propertyName = "expNotes";

        let value = true as unknown as string;
        let result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();
      });

      test("for range on non-range property", () => {
        const dataType = "integer";
        const propertyName = "expNotes";

        let value = "8-10";
        let result = validateValueInput(value, dataType, propertyName);
        expect(result).not.toBeNull();

        value = "8.0-10.0";
        result = validateValueInput(value, "decimal", propertyName);
        expect(result).not.toBeNull();
      });
    });

    suite("range", () => {
      suite("returns null", () => {
        test("for valid integer range", () => {
          const dataType = "integer";
          const propertyName = "expReps";

          let value = "8-10";
          let result = validateValueInput(value, dataType, propertyName, true);
          expect(result).toBeNull();

          value = "8 - 10";
          result = validateValueInput(value, dataType, propertyName, true);
          expect(result).toBeNull();
        });

        test("for valid decimal range", () => {
          const dataType = "decimal";
          const propertyName = "expWeight";

          let value = "1.5-2.5";
          let result = validateValueInput(value, dataType, propertyName, true);
          expect(result).toBeNull();

          value = "1-2";
          result = validateValueInput(value, dataType, propertyName, true);
          expect(result).toBeNull();
        });
      });

      suite("returns error", () => {
        test("for invalid integer range", () => {
          const dataType = "integer";
          const propertyName = "expReps";

          let value = "8-abc";
          let result = validateValueInput(value, dataType, propertyName, true);
          expect(result).not.toBeNull();

          value = "8-1.5";
          result = validateValueInput(value, dataType, propertyName, true);
          expect(result).not.toBeNull();

          value = "-810";
          result = validateValueInput(value, dataType, propertyName, true);
          expect(result).not.toBeNull();

          value = "-81";
          result = validateValueInput(value, dataType, propertyName, true);
          expect(result).not.toBeNull();

          value = "8";
          result = validateValueInput(value, dataType, propertyName, true);
          expect(result).not.toBeNull();

          value = "8.0";
          result = validateValueInput(value, dataType, propertyName, true);
          expect(result).not.toBeNull();
        });

        test("for invalid decimal range", () => {
          const dataType = "decimal";
          const propertyName = "expWeight";

          let value = "abc-2.5";
          let result = validateValueInput(value, dataType, propertyName, true);
          expect(result).not.toBeNull();

          value = "1.5-abc";
          result = validateValueInput(value, dataType, propertyName, true);
          expect(result).not.toBeNull();

          value = "-1.5";
          result = validateValueInput(value, dataType, propertyName, true);
          expect(result).not.toBeNull();

          value = "1.5--2.5";
          result = validateValueInput(value, dataType, propertyName, true);
          expect(result).not.toBeNull();
        });
      });
    });
  });

  suite("cleanAndValidateValueInput", () => {
    suite("returns clean value", () => {
      test("for valid input", () => {
        let dataType: DataType = "integer";
        const propertyName = "expExertion";

        let value = "8";
        let result = cleanAndValidateValueInput(value, dataType, propertyName);
        expect(result.value).toBe(value);

        let valueWithSpaces = " " + value + " ";
        result = cleanAndValidateValueInput(
          valueWithSpaces,
          dataType,
          propertyName
        );
        expect(result.value).toBe(value);

        value = "True";
        dataType = "boolean";
        result = cleanAndValidateValueInput(value, dataType, propertyName);
        expect(result.value).toBe(value.toLowerCase());
      });

      test("for valid input range", () => {
        let dataType: DataType = "integer";
        const propertyName = "expReps";

        const value1 = "8.0";
        const value2 = "10.0";
        const value = `${value1}-${value2}`;

        let result = cleanAndValidateValueInput(
          value,
          dataType,
          propertyName,
          true
        );
        expect(result.value).toBe(value);

        let valueWithSpaces = ` ${value1} - ${value2}`;
        result = cleanAndValidateValueInput(
          valueWithSpaces,
          dataType,
          propertyName,
          true
        );
        expect(result.value).toBe(value);
      });
    });

    suite("returns error", () => {
      test("for invalid input range datatype combo", () => {
        const propertyName = "expExertion";
        const dataType = "string";
        const value = "8";
        const result = cleanAndValidateValueInput(
          value,
          dataType,
          propertyName,
          true
        );
        expect(result.error).not.toBeNull();
      });

      test("for invalid datatype", () => {
        const propertyName = "expExertion";
        const dataType = "unknown" as DataType;
        const value = "8";
        const result = cleanAndValidateValueInput(
          value,
          dataType,
          propertyName
        );
        expect(result.error).not.toBeNull();
      });
    });
  });
});
