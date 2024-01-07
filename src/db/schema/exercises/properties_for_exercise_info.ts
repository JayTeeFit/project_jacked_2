import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { exerciseInfoProperties } from "src/db/schema/exercises/exercise_info_properties";
import { dynamicPropertiesSchema } from "src/db/schema/utils/schema_helpers";

export const propertiesForExerciseInfo = pgTable(
  "properties_for_exercise_info",
  {
    ...dynamicPropertiesSchema,
  }
);

export const preopertiesForExerciseInfoRelations = relations(
  propertiesForExerciseInfo,
  ({ many }) => ({
    exerciseInfoProperties: many(exerciseInfoProperties),
  })
);
