import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { propertiesForRoutineDetails } from "src/db/schema/routines/properties_for_routine_details";
import { routineDetails } from "src/db/schema/routines/routine_details";

export const routineDetailProperties = pgTable(
  "routine_detail_properties",
  {
    detailId: integer("detail_id")
      .references(() => routineDetails.id, { onDelete: "cascade" })
      .notNull(),
    propertyId: integer("property_id")
      .references(() => propertiesForRoutineDetails.id, {
        onDelete: "cascade",
      })
      .notNull(),
    value: text("value"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.detailId, t.propertyId] }),
  })
);

export const routineDetailPropertiesRelations = relations(
  routineDetailProperties,
  ({ one }) => ({
    detail: one(routineDetails, {
      fields: [routineDetailProperties.detailId],
      references: [routineDetails.id],
    }),
    property: one(propertiesForRoutineDetails, {
      fields: [routineDetailProperties.propertyId],
      references: [propertiesForRoutineDetails.id],
    }),
  })
);

export type RoutineDetailPropertySchema =
  typeof routineDetailProperties.$inferSelect;
export type NewRoutineDetailPropertySchema =
  typeof routineDetailProperties.$inferInsert;
