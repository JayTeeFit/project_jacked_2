import { relations } from "drizzle-orm";
import { date, integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import {
  trashableObjectColumns,
  createdAndUpdatedAtColumns,
} from "src/db/schema/utils/schema_helpers";
import { exerciseDetails } from "src/db/schema/exercises/exercise_details";
import { users } from "src/db/schema/users/users";

export const userExercises = pgTable("user_exercises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  detailId: integer("detail_id")
    .notNull()
    .references(() => exerciseDetails.id, { onDelete: "cascade" }),
  date: date("date").default("1970-01-01"),
  ...createdAndUpdatedAtColumns(),
  ...trashableObjectColumns(),
});

export const userExercisesRelations = relations(userExercises, ({ one }) => ({
  user: one(users, {
    fields: [userExercises.userId],
    references: [users.id],
  }),
  info: one(exerciseDetails, {
    fields: [userExercises.detailId],
    references: [exerciseDetails.id],
  }),
}));

export type UserExerciseSchema = typeof userExercises.$inferSelect;
export type NewUserExerciseSchema = typeof userExercises.$inferInsert;
