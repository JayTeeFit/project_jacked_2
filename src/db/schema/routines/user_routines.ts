import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { userExercises } from "src/db/schema/exercises";
import { routineDetails } from "src/db/schema/routines/routine_details";
import { userTrainingDays } from "src/db/schema/training_days/user_training_days";
import { users } from "src/db/schema/users";
import {
  trashableObjectColumns,
  createdAndUpdatedAtColumns,
  listOrderColumn,
} from "src/db/schema/utils/schema_helpers";

export const userRoutines = pgTable("user_routines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  detailId: integer("detail_id")
    .references(() => routineDetails.id, {
      onDelete: "restrict",
    })
    .notNull(),
  trainingDayId: integer("training_day_id")
    .references(() => userTrainingDays.id, { onDelete: "cascade" })
    .notNull(),
  isExercise: boolean("is_exercise").default(false).notNull(),
  ...listOrderColumn(),
  ...createdAndUpdatedAtColumns(),
  ...trashableObjectColumns(),
});

export const userRoutinesRelations = relations(
  userRoutines,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userRoutines.userId],
      references: [users.id],
    }),
    details: one(routineDetails, {
      fields: [userRoutines.detailId],
      references: [routineDetails.id],
    }),
    trainingDay: one(userTrainingDays, {
      fields: [userRoutines.trainingDayId],
      references: [userTrainingDays.id],
    }),
    exercises: many(userExercises),
  })
);

export type UserRoutineSchema = typeof userRoutines.$inferSelect;
export type NewUserRoutineSchema = typeof userRoutines.$inferInsert;
