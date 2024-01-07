import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { exerciseDetails } from "src/db/schema/exercises/exercise_details";
import { propertiesForExerciseDetails } from "src/db/schema/exercises/properties_for_exercise_details";

export const exerciseDetailProperties = pgTable(
  "exercise_detail_properties",
  {
    detailId: integer("detail_id")
      .references(() => exerciseDetails.id, { onDelete: "cascade" })
      .notNull(),
    propertyId: integer("property_id")
      .references(() => propertiesForExerciseDetails.id, {
        onDelete: "cascade",
      })
      .notNull(),
    value: text("value"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.detailId, t.propertyId] }),
  })
);

export const exerciseDetailPropertiesRelations = relations(
  exerciseDetailProperties,
  ({ one }) => ({
    detail: one(exerciseDetails, {
      fields: [exerciseDetailProperties.detailId],
      references: [exerciseDetails.id],
    }),
    property: one(propertiesForExerciseDetails, {
      fields: [exerciseDetailProperties.propertyId],
      references: [propertiesForExerciseDetails.id],
    }),
  })
);

export type ExerciseDetailPropertySchema =
  typeof exerciseDetailProperties.$inferSelect;
export type NewExerciseDetailPropertySchema =
  typeof exerciseDetailProperties.$inferInsert;
