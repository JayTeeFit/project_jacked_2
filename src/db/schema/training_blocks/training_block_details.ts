import { relations } from "drizzle-orm";
import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { users } from "src/db/schema/users/users";
import { trainingBlockDetailProperties } from "src/db/schema/training_blocks/training_block_detail_properties";
import { userTrainingBlocks } from "src/db/schema/training_blocks/user_training_blocks";

export const trainingBlockDetails = pgTable("training_block_details", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id, {
    onDelete: "cascade",
  }),
});

export const trainingBlockDetailsRelations = relations(
  trainingBlockDetails,
  ({ one, many }) => ({
    trainingBlocks: many(userTrainingBlocks),
    properties: many(trainingBlockDetailProperties),
    creator: one(users, {
      fields: [trainingBlockDetails.creatorId],
      references: [users.id],
    }),
  })
);

export type TrainingBlockDetailSchema =
  typeof trainingBlockDetails.$inferSelect;
export type NewTrainingBlockDetailSchema =
  typeof trainingBlockDetails.$inferInsert;
