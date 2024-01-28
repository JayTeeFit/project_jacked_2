import { relations } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { setProperties } from "src/db/schema/exercise_sets/set_properties";
import { dataTypesEnum } from "src/db/schema/types/dynamic_properties";
import { allowedPropertiesForSets } from "src/db/schema/types/sets";

export const propertiesForSets = pgTable("properties_for_sets", {
  id: serial("id").primaryKey(),
  name: text("name", { enum: allowedPropertiesForSets }).unique().notNull(),
  dataType: text("data_type", { enum: dataTypesEnum }).notNull(),
});

export const propertiesForSetsRelations = relations(
  propertiesForSets,
  ({ many }) => ({
    setProperties: many(setProperties),
  })
);

export type PropertyForSetSchema = typeof propertiesForSets.$inferSelect;
export type NewPropertyForSetSchema = typeof propertiesForSets.$inferInsert;
