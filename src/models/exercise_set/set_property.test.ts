import { ExerciseSetSchema, NewSetPropertySchema } from "src/db/schema";
import SetProperty, {
  CreateSetProperty,
} from "src/models/exercise_set/set_property";
import User from "src/models/user/user";
import { ResponseStatus } from "src/models/utils/model_responses";
import { seedPropertiesForSets } from "src/models/utils/property_for_set_test_helpers";
import { seedRoutines } from "src/models/utils/temp_test_helpers";
import { createDefaultUser } from "src/models/utils/user_test_helpers";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";

dbTestSuite(
  "SetProperty",
  () => {
    let exerciseSets: ExerciseSetSchema[];
    let user: User | null;

    async function createProperty(
      propertySchema: CreateSetProperty,
      shouldError = false
    ) {
      const { value: property, errorMessage } = await SetProperty.create(
        propertySchema
      );

      if (shouldError) {
        expect(errorMessage).not.toBeNull();
        expect(property).toBeNull();
        return null;
      }

      expect(errorMessage).toBeNull();
      expect(property).not.toBeNull();

      return property;
    }

    beforeEach(async () => {
      await seedPropertiesForSets();
      user = await createDefaultUser({}, true);
      expect(user).not.toBeNull();

      ({ exerciseSets } = await seedRoutines(user!));
    });

    suite("Create", () => {
      test("Creates new set properties", async () => {
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

      test("Can assign identical properties to different sets", async () => {
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
