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
