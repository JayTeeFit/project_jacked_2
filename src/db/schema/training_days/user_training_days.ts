import { relations } from "drizzle-orm";
import { date, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { userRoutines } from "src/db/schema/routines";
import { users } from "src/db/schema/users/users";
import {
  createdAndUpdatedAtColumns,
  trashableObjectColumns,
} from "src/db/schema/utils/schema_helpers";

export const userTrainingDays = pgTable("user_training_days", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  date: date("date").default("1970-01-01").notNull(),
  ...createdAndUpdatedAtColumns(),
  ...trashableObjectColumns(),
});

export const userTrainingDaysRelations = relations(
  userTrainingDays,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userTrainingDays.userId],
      references: [users.id],
    }),
    routines: many(userRoutines),
  })
);

export type UserTrainingDaySchema = typeof userTrainingDays.$inferSelect;
export type NewUserTrainingDaySchema = typeof userTrainingDays.$inferInsert;
