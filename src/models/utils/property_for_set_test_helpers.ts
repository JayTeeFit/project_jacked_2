import { NewPropertyForSetSchema } from "src/db/schema/exercise_sets/properties_for_sets";
import { PropertyForSetName } from "src/db/schema/types/sets";
import PropertyForSet from "src/models/exercise_set/property_for_set";

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
