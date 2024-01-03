import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { setProperties } from "src/db/schema/exercise_sets/set_properties";
import { dynamicPropertiesSchema } from "src/db/schema/utils/schema_helpers";

export const propertiesForSets = pgTable("properties_for_sets", {
  ...dynamicPropertiesSchema,
});

export const propertiesForSetsRelations = relations(
  propertiesForSets,
  ({ many }) => ({
    setProperties: many(setProperties),
  })
);
