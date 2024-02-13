import { UserExerciseSchema } from "src/db/schema/exercises";
import { NewExerciseSetSchema } from "src/db/schema/exercise_sets";
import User from "src/models/user/user";
import {
  seedPropertiesForSets,
  createSetAndValidate,
  defaultSetSchema,
} from "src/test_helpers/exercise_set_test_helpers";
import { seedRoutines } from "src/test_helpers/temp_test_helpers";
import { createDefaultUser } from "src/test_helpers/user_test_helpers";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";
import SetProperty from "src/models/exercise_set/set_property";
import { ValueValidationError } from "src/models/utils/property_validation_helpers";
import { ResponseStatus } from "src/models/utils/model_responses";

dbTestSuite(
  "ExerciseSet",
  () => {
    let user: User | null;
    let exercise: UserExerciseSchema;

    beforeEach(async () => {
      await seedPropertiesForSets();
      user = await createDefaultUser({}, true);
      expect(user).not.toBeNull();

      ({ exercise } = await seedRoutines(user!));
    });

    suite("Create", () => {
      test("Creates new exercise set", async () => {
        const newSet = defaultSetSchema(exercise.id);

        await createSetAndValidate(newSet);
      });

      test("Creates multiple sets for a single exercise", async () => {
        const newSet = defaultSetSchema(exercise.id);

        const newSet2: NewExerciseSetSchema = {
          listOrder: 100,
          exerciseId: exercise.id,
          actualWeight: "100",
          actualReps: 10,
          actualExertion: 8,
          weightUnits: "lbs",
          exertionUnits: "RPE",
        };

        await createSetAndValidate(newSet);
        await createSetAndValidate(newSet2);
      });
    });

    suite("addProperty", () => {
      test("Adds property to set", async () => {
        const newSet = defaultSetSchema(exercise.id);
        const exerciseSet = await createSetAndValidate(newSet);

        const { value: property, errorMessage } = await exerciseSet.addProperty(
          "expExertion",
          "8"
        );

        expect(property).not.toBeNull();
        expect(errorMessage).toBeNull();
        expect(property!.name).toBe("expExertion");
        expect(property!.value).toBe("8");
      });

      test("returns error if property already exists", async () => {
        const newSet = defaultSetSchema(exercise.id);
        const exerciseSet = await createSetAndValidate(newSet);

        await exerciseSet.addProperty("expExertion", "8");

        const { value: property, errorMessage } = await exerciseSet.addProperty(
          "expExertion",
          "8"
        );

        expect(property).toBeNull();
        expect(errorMessage).not.toBeNull();
      });

      test("returns error if property is empty", async () => {
        const newSet = defaultSetSchema(exercise.id);
        const exerciseSet = await createSetAndValidate(newSet);

        const { value: property, errorMessage } = await exerciseSet.addProperty(
          "expExertion",
          ""
        );

        expect(property).toBeNull();
        expect(errorMessage).not.toBeNull();
      });
    });

    suite("getProperties", () => {
      test("Returns empty array if there are no properties", async () => {
        const newSet = defaultSetSchema(exercise.id);
        const exerciseSet = await createSetAndValidate(newSet);

        const properties = await exerciseSet.getProperties();
        expect(properties).not.toBeNull();
        expect(Object.keys(properties).length).toBe(0);
      });

      test("Returns properties for set", async () => {
        const newSet = defaultSetSchema(exercise.id);
        const exerciseSet = await createSetAndValidate(newSet);

        await exerciseSet.addProperty("expExertion", "8");
        await exerciseSet.addProperty("expExertionUnits", "RPE");

        const properties = await exerciseSet.getProperties();
        expect(properties).not.toBeNull();
        expect(Object.keys(properties).length).toBe(2);
        expect(properties.expExertion).not.toBeUndefined();
        expect(properties.expExertionUnits).not.toBeUndefined();
        expect(properties.expExertion).toBeInstanceOf(SetProperty);
        expect(properties.expExertionUnits).toBeInstanceOf(SetProperty);
      });
    });

    suite("setProperty", () => {
      test("updates property value if exists", async () => {
        const newSet = defaultSetSchema(exercise.id);
        const exerciseSet = await createSetAndValidate(newSet);

        await exerciseSet.addProperty("expExertion", "8");

        const { value: property, errorMessage } = await exerciseSet.setProperty(
          "expExertion",
          "9"
        );

        expect(property).not.toBeNull();
        expect(errorMessage).toBeNull();
        expect(property!.value).toBe("9");

        const properties = await exerciseSet.getProperties();

        expect(properties.expExertion).not.toBeUndefined();
        expect(properties.expExertion!.value).toBe("9");
      });

      test("adds property if it doesn't exist", async () => {
        const newSet = defaultSetSchema(exercise.id);
        const exerciseSet = await createSetAndValidate(newSet);

        const { value: property, errorMessage } = await exerciseSet.setProperty(
          "expExertion",
          "9"
        );

        expect(property).not.toBeNull();
        expect(errorMessage).toBeNull();
        expect(property!.value).toBe("9");

        const properties = await exerciseSet.getProperties();

        expect(properties.expExertion).not.toBeUndefined();
        expect(properties.expExertion!.value).toBe("9");
      });

      test("returns error if property is empty", async () => {
        const newSet = defaultSetSchema(exercise.id);
        const exerciseSet = await createSetAndValidate(newSet);

        const { value: property, errorMessage } = await exerciseSet.setProperty(
          "expExertion",
          ""
        );

        expect(property).toBeNull();
        expect(errorMessage).not.toBeNull();
      });
    });

    suite("removeProperty", () => {
      test("removes property if exists", async () => {
        const newSet = defaultSetSchema(exercise.id);
        const exerciseSet = await createSetAndValidate(newSet);

        await exerciseSet.addProperty("expExertion", "8");

        const { status, errorMessage } = await exerciseSet.removeProperty(
          "expExertion"
        );

        expect(status).toBe(ResponseStatus.SUCCESS);
        expect(errorMessage).toBeNull();

        const properties = await exerciseSet.getProperties();
        expect(properties.expExertion).toBeUndefined();
      });

      test("returns error if property doesn't exist", async () => {
        const newSet = defaultSetSchema(exercise.id);
        const exerciseSet = await createSetAndValidate(newSet);

        const { status, errorMessage } = await exerciseSet.removeProperty(
          "expExertion"
        );

        expect(status).toBe(ResponseStatus.FAILURE);
        expect(errorMessage).not.toBeNull();
      });
    });
  },
  { logger: false }
);
