import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { exerciseSets } from "src/db/schema/exercise_sets/exercise_sets";
import { propertiesForSets } from "src/db/schema/exercise_sets/properties_for_sets";

export const setProperties = pgTable(
  "set_properties",
  {
    setId: integer("set_id").references(() => exerciseSets.id, {
      onDelete: "cascade",
    }),
    propertyId: integer("property_id").references(() => propertiesForSets.id, {
      onDelete: "cascade",
    }),
    value: text("value"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.setId, t.propertyId] }),
  })
);

export const setPropertiesRelations = relations(setProperties, ({ one }) => ({
  set: one(exerciseSets, {
    fields: [setProperties.setId],
    references: [exerciseSets.id],
  }),
  property: one(propertiesForSets, {
    fields: [setProperties.propertyId],
    references: [propertiesForSets.id],
  }),
}));

export type SetPropertySchema = typeof setProperties.$inferSelect;
export type NewSetPropertySchema = typeof setProperties.$inferInsert;
