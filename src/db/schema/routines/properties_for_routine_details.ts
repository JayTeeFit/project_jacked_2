import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { dynamicPropertiesSchema } from "src/db/schema/utils/schema_helpers";
import { routineDetailProperties } from "src/db/schema/routines/routine_detail_properties";

export const propertiesForRoutineDetails = pgTable(
  "properties_for_routine_details",
  dynamicPropertiesSchema()
);

export const propertiesForRoutineDetailsRelations = relations(
  propertiesForRoutineDetails,
  ({ many }) => ({
    detailProperties: many(routineDetailProperties),
  })
);

export type PropertyForRoutineDetailSchema =
  typeof propertiesForRoutineDetails.$inferSelect;
export type NewPropertyForRoutineDetailSchema =
  typeof propertiesForRoutineDetails.$inferInsert;
