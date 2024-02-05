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
        const error = validateValueInput(value, dataType, propertyName);
        expect(error).toBeNull();
      });

      test("for valid decimal", () => {
        const dataType = "decimal";
        const propertyName = "expWeight";

        let value = "1.5";
        let error = validateValueInput(value, dataType, propertyName);
        expect(error).toBeNull();

        value = "1";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).toBeNull();
      });

      test("for valid boolean", () => {
        const dataType = "boolean";
        const propertyName = "expIsWarmup";

        let value = "true";
        let error = validateValueInput(value, dataType, propertyName);
        expect(error).toBeNull();

        value = "false";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).toBeNull();
      });

      test("for valid string", () => {
        const dataType = "string";
        const propertyName = "expNotes";

        let value = "abc";
        let error = validateValueInput(value, dataType, propertyName);
        expect(error).toBeNull();

        value = "true";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).toBeNull();
      });
    });

    suite("returns error", () => {
      test("for invalid integer", () => {
        const dataType = "integer";
        const propertyName = "expExertion";

        let value = "abc";
        let error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "1.5";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "true";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();
      });

      test("for invalid decimal", () => {
        const dataType = "decimal";
        const propertyName = "expWeight";

        let value = "abc";
        let error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "true";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "4.a";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();
      });

      test("for invalid boolean", () => {
        const dataType = "boolean";
        const propertyName = "expIsWarmup";

        let value = "abc";
        let error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "1";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "True";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "False";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();
      });

      test("for invalid string", () => {
        const dataType = "string";
        const propertyName = "expNotes";

        let value = true as unknown as string;
        let error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "";
        error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();
      });

      test("for range on non-range property", () => {
        const dataType = "integer";
        const propertyName = "expNotes";

        let value = "8-10";
        let error = validateValueInput(value, dataType, propertyName);
        expect(error).not.toBeNull();

        value = "8.0-10.0";
        error = validateValueInput(value, "decimal", propertyName);
        expect(error).not.toBeNull();
      });
    });

    suite("range", () => {
      suite("returns null", () => {
        test("for valid integer range", () => {
          const dataType = "integer";
          const propertyName = "expReps";

          let value = "8-10";
          let error = validateValueInput(value, dataType, propertyName, true);
          expect(error).toBeNull();

          value = "8 - 10";
          error = validateValueInput(value, dataType, propertyName, true);
          expect(error).toBeNull();
        });

        test("for valid decimal range", () => {
          const dataType = "decimal";
          const propertyName = "expWeight";

          let value = "1.5-2.5";
          let error = validateValueInput(value, dataType, propertyName, true);
          expect(error).toBeNull();

          value = "1-2";
          error = validateValueInput(value, dataType, propertyName, true);
          expect(error).toBeNull();
        });
      });

      suite("returns error", () => {
        test("for invalid integer range", () => {
          const dataType = "integer";
          const propertyName = "expReps";

          let value = "8-abc";
          let error = validateValueInput(value, dataType, propertyName, true);
          expect(error).not.toBeNull();

          value = "8-1.5";
          error = validateValueInput(value, dataType, propertyName, true);
          expect(error).not.toBeNull();

          value = "-810";
          error = validateValueInput(value, dataType, propertyName, true);
          expect(error).not.toBeNull();

          value = "-81";
          error = validateValueInput(value, dataType, propertyName, true);
          expect(error).not.toBeNull();

          value = "8";
          error = validateValueInput(value, dataType, propertyName, true);
          expect(error).not.toBeNull();

          value = "8.0";
          error = validateValueInput(value, dataType, propertyName, true);
          expect(error).not.toBeNull();
        });

        test("for invalid decimal range", () => {
          const dataType = "decimal";
          const propertyName = "expWeight";

          let value = "abc-2.5";
          let error = validateValueInput(value, dataType, propertyName, true);
          expect(error).not.toBeNull();

          value = "1.5-abc";
          error = validateValueInput(value, dataType, propertyName, true);
          expect(error).not.toBeNull();

          value = "-1.5";
          error = validateValueInput(value, dataType, propertyName, true);
          expect(error).not.toBeNull();

          value = "1.5--2.5";
          error = validateValueInput(value, dataType, propertyName, true);
          expect(error).not.toBeNull();
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
        let error = cleanAndValidateValueInput(value, dataType, propertyName);
        expect(error.value).toBe(value);

        let valueWithSpaces = " " + value + " ";
        error = cleanAndValidateValueInput(
          valueWithSpaces,
          dataType,
          propertyName
        );
        expect(error.value).toBe(value);

        value = "True";
        dataType = "boolean";
        error = cleanAndValidateValueInput(value, dataType, propertyName);
        expect(error.value).toBe(value.toLowerCase());
      });

      test("for valid input range", () => {
        let dataType: DataType = "integer";
        const propertyName = "expReps";

        const value1 = "8.0";
        const value2 = "10.0";
        const value = `${value1}-${value2}`;

        let error = cleanAndValidateValueInput(
          value,
          dataType,
          propertyName,
          true
        );
        expect(error.value).toBe(value);

        let valueWithSpaces = ` ${value1} - ${value2}`;
        error = cleanAndValidateValueInput(
          valueWithSpaces,
          dataType,
          propertyName,
          true
        );
        expect(error.value).toBe(value);
      });
    });

    suite("returns error", () => {
      test("for invalid input range datatype combo", () => {
        const propertyName = "expExertion";
        const dataType = "string";
        const value = "8";
        const error = cleanAndValidateValueInput(
          value,
          dataType,
          propertyName,
          true
        );
        expect(error.error).not.toBeNull();
      });

      test("for invalid datatype", () => {
        const propertyName = "expExertion";
        const dataType = "unknown" as DataType;
        const value = "8";
        const error = cleanAndValidateValueInput(value, dataType, propertyName);
        expect(error.error).not.toBeNull();
      });
    });
  });
});
