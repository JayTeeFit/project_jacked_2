import { ExerciseSetSchema } from "src/db/schema";
import { CreateSetProperty } from "src/models/exercise_set/set_property";
import User from "src/models/user/user";
import { ResponseStatus } from "src/models/utils/model_responses";
import { seedPropertiesForSets } from "src/test_helpers/exercise_set_test_helpers";
import { createProperty } from "src/test_helpers/exercise_set_test_helpers";
import { seedRoutines } from "src/test_helpers/temp_test_helpers";
import { createDefaultUser } from "src/test_helpers/user_test_helpers";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";

dbTestSuite(
  "SetProperty",
  () => {
    let exerciseSets: ExerciseSetSchema[];
    let user: User | null;

    beforeEach(async () => {
      await seedPropertiesForSets();
      user = await createDefaultUser({}, true);
      expect(user).not.toBeNull();

      ({ exerciseSets } = await seedRoutines(user!));
    });

    suite("Create", () => {
      test("Creates new set property", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };

        const property = await createProperty(propertyCreateSchema);

        expect(property!.name).toBe(propertyCreateSchema.propertyName);
        expect(property!.value).toBe(propertyCreateSchema.value);
      });

      test("Creates multiple properties for a single set", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };

        const propertyCreateSchema2: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertionUnits",
          value: "RPE",
        };

        const property = await createProperty(
          propertyCreateSchema,
          /* shouldError */ false
        );

        const property2 = await createProperty(
          propertyCreateSchema2,
          /* shouldError */ false
        );
      });

      test("Returns error if property already exists on set", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };

        const propertyCreateSchema2: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };
        const property = await createProperty(
          propertyCreateSchema,
          /* shouldError */ false
        );

        const property2 = await createProperty(
          propertyCreateSchema2,
          /* shouldError */ true
        );
      });

      test("Can assign properties to different sets", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };

        const propertyCreateSchema2: CreateSetProperty = {
          setId: exerciseSets[1].id,
          propertyName: "expExertion",
          value: "8",
        };
        const property = await createProperty(
          propertyCreateSchema,
          /* shouldError */ false
        );

        const property2 = await createProperty(
          propertyCreateSchema2,
          /* shouldError */ false
        );
      });

      test("Returns error if property value invalid", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "abc",
        };

        await createProperty(propertyCreateSchema, /* shouldError */ true);
      });

      test("Sets isRange true for input value range", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8-10",
        };

        const property = await createProperty(
          propertyCreateSchema,
          /* shouldError */ false
        );

        expect(property!.isRange).toBe(true);
      });

      test("Sets isRange false correctly", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };

        const property = await createProperty(
          propertyCreateSchema,
          /* shouldError */ false
        );

        expect(property!.isRange).toBe(false);
      });
    });

    suite("updatePropertyValue", () => {
      test("Can update property value", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };

        const property = await createProperty(
          propertyCreateSchema,
          /* shouldError */ false
        );

        await property!.updatePropertyValue("9");

        expect(property!.name).toBe("expExertion");
        expect(property!.value).toBe("9");
      });

      test("Returns error if value is invalid", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };

        const property = await createProperty(
          propertyCreateSchema,
          /* shouldError */ false
        );

        const { errorMessage } = await property!.updatePropertyValue("abc");

        expect(errorMessage).not.toBeNull();
        expect(property!.value).toBe("8");
      });

      test("Returns error if value is null", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };

        const property = await createProperty(
          propertyCreateSchema,
          /* shouldError */ false
        );

        const { errorMessage } = await property!.updatePropertyValue("");

        expect(errorMessage).not.toBeNull();
        expect(property!.value).toBe("8");
      });

      test("Updates property isRange if allowed", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };

        const property = await createProperty(
          propertyCreateSchema,
          /* shouldError */ false
        );

        expect(property!.isRange).toBe(false);

        let { errorMessage } = await property!.updatePropertyValue("8-10");

        expect(errorMessage).toBeNull();
        expect(property!.value).toBe("8-10");
        expect(property!.isRange).toBe(true);

        ({ errorMessage } = await property!.updatePropertyValue("8"));

        expect(errorMessage).toBeNull();
        expect(property!.value).toBe("8");
        expect(property!.isRange).toBe(false);
      });
    });

    suite("remove", () => {
      test("Removes property", async () => {
        const propertyCreateSchema: CreateSetProperty = {
          setId: exerciseSets[0].id,
          propertyName: "expExertion",
          value: "8",
        };

        const property = await createProperty(
          propertyCreateSchema,
          /* shouldError */ false
        );

        const { status, errorMessage } = await property!.remove();

        expect(status).toBe(ResponseStatus.SUCCESS);
        expect(errorMessage).toBeNull();
      });
    });
  },
  { logger: false }
);
