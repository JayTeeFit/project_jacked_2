import {
  pgTable,
  serial,
  varchar,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { listOrderColumn } from "src/db/schema/utils/schema_helpers";
import { userExercises } from "src/db/schema/exercises/user_exercises";
import { weightUnitsEnum, exertionUnitsEnum } from "src/db/schema/types/units";
import { setProperties } from "src/db/schema/exercise_sets/set_properties";

export const exerciseSets = pgTable("exercise_sets", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id")
    .references(() => userExercises.id, { onDelete: "cascade" })
    .notNull(),
  actualWeight: decimal("actual_weight", {
    precision: 4,
    scale: 2,
  }),
  actualReps: integer("actual_reps"),
  actualExertion: integer("actual_exertion"),
  weightUnits: varchar("weight_units", {
    length: 5,
    enum: weightUnitsEnum,
  }),
  exertionUnits: varchar("exertion_units", {
    length: 10,
    enum: exertionUnitsEnum,
  }),
  ...listOrderColumn,
});

export const exerciseSetsRelations = relations(
  exerciseSets,
  ({ one, many }) => ({
    exercise: one(userExercises, {
      fields: [exerciseSets.exerciseId],
      references: [userExercises.id],
    }),
    properties: many(setProperties),
  })
);

export type UserExerciseSchema = typeof userExercises.$inferSelect;
export type NewUserExerciseSchema = typeof userExercises.$inferInsert;
