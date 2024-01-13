import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { dynamicPropertiesSchema } from "src/db/schema/utils/schema_helpers";
import { trainingBlockDetailProperties } from "src/db/schema/training_blocks/training_block_detail_properties";

export const propertiesForTrainingBlockDetails = pgTable(
  "properties_for_training_block_details",
  dynamicPropertiesSchema()
);

export const propertiesForTrainingBlockDetailsRelations = relations(
  propertiesForTrainingBlockDetails,
  ({ many }) => ({
    detailProperties: many(trainingBlockDetailProperties),
  })
);

export type PropertyForTrainingBlockDetailSchema =
  typeof propertiesForTrainingBlockDetails.$inferSelect;
export type NewPropertyForTrainingBlockDetailSchema =
  typeof propertiesForTrainingBlockDetails.$inferInsert;
