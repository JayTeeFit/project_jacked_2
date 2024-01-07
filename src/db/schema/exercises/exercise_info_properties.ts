import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { exerciseInfo } from "src/db/schema/exercises/exercise_info";
import { propertiesForExerciseInfo } from "src/db/schema/exercises/properties_for_exercise_info";

export const exerciseInfoProperties = pgTable(
  "exercise_info_properties",
  {
    exerciseInfoId: integer("exercise_info_id")
      .references(() => exerciseInfo.id, { onDelete: "cascade" })
      .notNull(),
    propertyId: integer("property_id")
      .references(() => propertiesForExerciseInfo.id, { onDelete: "cascade" })
      .notNull(),
    value: text("value"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.exerciseInfoId, t.propertyId] }),
  })
);

export const exerciseInfoPropertiesRelations = relations(
  exerciseInfoProperties,
  ({ one }) => ({
    exerciseInfo: one(exerciseInfo, {
      fields: [exerciseInfoProperties.exerciseInfoId],
      references: [exerciseInfo.id],
    }),
    property: one(propertiesForExerciseInfo, {
      fields: [exerciseInfoProperties.propertyId],
      references: [propertiesForExerciseInfo.id],
    }),
  })
);
