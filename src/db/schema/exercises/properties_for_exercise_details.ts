import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { exerciseDetailProperties } from "src/db/schema/exercises/exercise_detail_properties";
import { dynamicPropertiesSchema } from "src/db/schema/utils/schema_helpers";

export const propertiesForExerciseDetails = pgTable(
  "properties_for_exercise_details",
  dynamicPropertiesSchema()
);

export const propertiesForExerciseDetailsRelations = relations(
  propertiesForExerciseDetails,
  ({ many }) => ({
    detailProperties: many(exerciseDetailProperties),
  })
);

export type PropertyForExerciseDetailSchema =
  typeof propertiesForExerciseDetails.$inferSelect;
export type NewPropertyForExerciseDetailSchema =
  typeof propertiesForExerciseDetails.$inferInsert;
