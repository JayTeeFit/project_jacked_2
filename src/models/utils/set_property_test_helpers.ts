import SetProperty, {
  CreateSetProperty,
} from "src/models/exercise_set/set_property";

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
