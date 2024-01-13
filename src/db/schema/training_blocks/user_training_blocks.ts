import { relations } from "drizzle-orm";
import { date, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { userRoutines } from "src/db/schema/routines";
import { trainingBlockDetails } from "src/db/schema/training_blocks/training_block_details";
import { users } from "src/db/schema/users/users";
import {
  createdAndUpdatedAtColumns,
  trashableObjectColumns,
} from "src/db/schema/utils/schema_helpers";

export const userTrainingBlocks = pgTable("user_training_blocks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  detailId: integer("detail_id").references(() => trainingBlockDetails.id, {
    onDelete: "restrict",
  }),
  date: date("date").default("1970-01-01"),
  ...createdAndUpdatedAtColumns(),
  ...trashableObjectColumns(),
});

export const userTrainingBlocksRelations = relations(
  userTrainingBlocks,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userTrainingBlocks.userId],
      references: [users.id],
    }),
    details: one(trainingBlockDetails, {
      fields: [userTrainingBlocks.detailId],
      references: [trainingBlockDetails.id],
    }),
    routines: many(userRoutines),
  })
);

export type UserTrainingBlock = typeof userTrainingBlocks.$inferSelect;
export type NewUserTrainingBlock = typeof userTrainingBlocks.$inferInsert;
