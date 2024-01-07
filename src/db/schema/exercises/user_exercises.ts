import { relations } from "drizzle-orm";
import { date, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { exerciseInfo } from "src/db/schema/exercises/exercise_info";
import { users } from "src/db/schema/users/users";

export const userExercises = pgTable("user_exercises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  infoId: integer("info_id")
    .notNull()
    .references(() => exerciseInfo.id, { onDelete: "cascade" }),
  date: date("date"),
});

export const userExercisesRelations = relations(userExercises, ({ one }) => ({
  user: one(users, {
    fields: [userExercises.userId],
    references: [users.id],
  }),
  info: one(exerciseInfo, {
    fields: [userExercises.infoId],
    references: [exerciseInfo.id],
  }),
}));

export type UserExerciseSchema = typeof userExercises.$inferSelect;
export type NewUserExerciseSchema = typeof userExercises.$inferInsert;
