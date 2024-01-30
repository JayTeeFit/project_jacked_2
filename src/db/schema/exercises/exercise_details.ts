import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { users } from "src/db/schema/users/users";
import { exerciseNames } from "src/db/schema/exercises/exercise_names";
import {
  trashableObjectColumns,
  createdAndUpdatedAtColumns,
} from "src/db/schema/utils/schema_helpers";
import { exerciseNameVariants } from "src/db/schema/exercises/exercise_name_variants";
import { relations } from "drizzle-orm";
import { userExercises } from "src/db/schema/exercises/user_exercises";
import { exerciseDetailProperties } from "src/db/schema/exercises/exercise_detail_properties";

export const exerciseDetails = pgTable("exercise_details", {
  id: serial("id").primaryKey(),
  nameId: integer("name_id")
    .references(() => exerciseNames.id, { onDelete: "cascade" })
    .notNull(),
  variantId: integer("variant_id").references(() => exerciseNameVariants.id, {
    onDelete: "set null",
  }),
  creatorId: integer("creator_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  ...createdAndUpdatedAtColumns(),
  ...trashableObjectColumns(),
});

export const exerciseDetailsRelations = relations(
  exerciseDetails,
  ({ one, many }) => ({
    variant: one(exerciseNameVariants, {
      fields: [exerciseDetails.variantId],
      references: [exerciseNameVariants.id],
    }),
    name: one(exerciseNames, {
      fields: [exerciseDetails.nameId],
      references: [exerciseNames.id],
    }),
    creator: one(users, {
      fields: [exerciseDetails.creatorId],
      references: [users.id],
    }),
    exercises: many(userExercises),
    properties: many(exerciseDetailProperties),
  })
);

export type ExerciseDetailSchema = typeof exerciseDetails.$inferSelect;
export type NewExerciseDetailSchema = typeof exerciseDetails.$inferInsert;
