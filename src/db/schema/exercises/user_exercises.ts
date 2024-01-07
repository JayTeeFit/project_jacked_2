import { date, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { exerciseInfo } from "src/db/schema/exercises/exercise_info";
import { users } from "src/db/schema/users/users";

export const userExercises = pgTable("user_exercises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  exerciseInfoId: integer("exercise_info_id")
    .notNull()
    .references(() => exerciseInfo.id, { onDelete: "cascade" }),
  date: date("date"),
});
