import SetProperty, {
  CreateSetProperty,
} from "src/models/exercise_set/set_property";
import { NewPropertyForSetSchema } from "src/db/schema/exercise_sets/properties_for_sets";
import { PropertyForSetName } from "src/db/schema/types/sets";
import PropertyForSet from "src/models/exercise_set/property_for_set";
import { NewExerciseSetSchema } from "src/db/schema/exercise_sets";
import ExerciseSet from "src/models/exercise_set/exercise_set";

export const createSetAndValidate = async (
  newSetSchema: NewExerciseSetSchema
) => {
  const result = await ExerciseSet.create(newSetSchema);
  expect(result!.value).not.toBeNull();
  expect(result!.errorMessage).toBeNull();
  expect(result!.value).toBeInstanceOf(ExerciseSet);

  return result!.value!;
};

export const defaultSetSchema = (exerciseId: number): NewExerciseSetSchema => ({
  listOrder: 0,
  exerciseId,
  actualWeight: "100",
  actualReps: 10,
  actualExertion: 8,
  weightUnits: "lbs",
  exertionUnits: "RPE",
});

export async function createProperty(
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

export const defaultProperties: Record<
  PropertyForSetName,
  NewPropertyForSetSchema
> = {
  expExertion: {
    name: "expExertion",
    dataType: "integer",
  },
  expExertionUnits: {
    name: "expExertionUnits",
    dataType: "string",
  },
  expWeight: {
    name: "expWeight",
    dataType: "decimal",
  },
  expWeightUnits: {
    name: "expWeightUnits",
    dataType: "string",
  },
  expReps: {
    name: "expReps",
    dataType: "integer",
  },
};

export async function seedPropertiesForSets() {
  const propertyNames = Object.keys(defaultProperties) as PropertyForSetName[];

  for (const propertyName of propertyNames) {
    const { value: property, errorMessage } = await PropertyForSet.create(
      defaultProperties[propertyName]
    );
    expect(errorMessage).toBeNull();
    expect(property).not.toBeNull();
  }
}
