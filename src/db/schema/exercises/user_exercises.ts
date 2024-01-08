import { relations } from "drizzle-orm";
import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import {
  trashableObjectColumns,
  createdAndUpdatedAtColumns,
  listOrderColumn,
} from "src/db/schema/utils/schema_helpers";
import { exerciseDetails } from "src/db/schema/exercises/exercise_details";
import { users } from "src/db/schema/users/users";
import { userRoutines } from "src/db/schema/routines/user_routines";
import { exerciseSets } from "src/db/schema/exercise_sets";

export const userExercises = pgTable("user_exercises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  detailId: integer("detail_id")
    .references(() => exerciseDetails.id, {
      onDelete: "restrict",
    })
    .notNull(),
  routineId: integer("routine_id")
    .references(() => userRoutines.id, { onDelete: "cascade" })
    .notNull(),
  ...listOrderColumn(),
  ...createdAndUpdatedAtColumns(),
  ...trashableObjectColumns(),
});

export const userExercisesRelations = relations(
  userExercises,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userExercises.userId],
      references: [users.id],
    }),
    details: one(exerciseDetails, {
      fields: [userExercises.detailId],
      references: [exerciseDetails.id],
    }),
    routine: one(userRoutines, {
      fields: [userExercises.routineId],
      references: [userRoutines.id],
    }),
    sets: many(exerciseSets),
  })
);

export type UserExerciseSchema = typeof userExercises.$inferSelect;
export type NewUserExerciseSchema = typeof userExercises.$inferInsert;
