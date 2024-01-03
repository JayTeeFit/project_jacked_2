import { date, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { exerciseTemplates } from "src/db/schema/exercises/exercise_templates";
import { users } from "src/db/schema/users/users";

export const userExercises = pgTable("user_exercises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exerciseTemplates.id, { onDelete: "cascade" }),
  routineId: integer("routine_id"),
  // .references(() => userRoutines.id, { onDelete: "cascade" }),
  date: date("date"),
});
