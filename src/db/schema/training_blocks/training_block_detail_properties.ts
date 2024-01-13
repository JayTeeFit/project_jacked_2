import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { trainingBlockDetails } from "src/db/schema/training_blocks/training_block_details";
import { propertiesForTrainingBlockDetails } from "src/db/schema/training_blocks/properties_for_training_block_details";

export const trainingBlockDetailProperties = pgTable(
  "training_block_detail_properties",
  {
    detailId: integer("detail_id")
      .references(() => trainingBlockDetails.id, { onDelete: "cascade" })
      .notNull(),
    propertyId: integer("property_id")
      .references(() => propertiesForTrainingBlockDetails.id, {
        onDelete: "cascade",
      })
      .notNull(),
    value: text("value"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.detailId, t.propertyId] }),
  })
);

export const trainingBlockDetailPropertiesRelations = relations(
  trainingBlockDetailProperties,
  ({ one }) => ({
    detail: one(trainingBlockDetails, {
      fields: [trainingBlockDetailProperties.detailId],
      references: [trainingBlockDetails.id],
    }),
    property: one(propertiesForTrainingBlockDetails, {
      fields: [trainingBlockDetailProperties.propertyId],
      references: [propertiesForTrainingBlockDetails.id],
    }),
  })
);

export type TrainingBlockDetailPropertySchema =
  typeof trainingBlockDetailProperties.$inferSelect;
export type NewTrainingBlockDetailPropertySchema =
  typeof trainingBlockDetailProperties.$inferInsert;
