import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { users } from "src/db/schema/users/users";
import { exerciseNames } from "src/db/schema/exercises/exercise_names";
import { trashableObjectColumns } from "src/db/schema/utils/schema_helpers";
import { exerciseNameVariants } from "src/db/schema/exercises/exercise_name_variants";
import { relations } from "drizzle-orm";
import { userExercises } from "src/db/schema/exercises/user_exercises";
import { exerciseInfoProperties } from "src/db/schema/exercises/exercise_info_properties";

export const exerciseInfo = pgTable("exercise_info", {
  id: serial("id").primaryKey(),
  nameId: integer("name_id")
    .references(() => exerciseNames.id, { onDelete: "cascade" })
    .notNull(),
  variantId: integer("variant_id").references(() => exerciseNameVariants.id, {
    onDelete: "cascade",
  }),
  creatorId: integer("creator_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  ...trashableObjectColumns,
});

export const exerciseInfoRelations = relations(
  exerciseInfo,
  ({ one, many }) => ({
    variant: one(exerciseNameVariants, {
      fields: [exerciseInfo.variantId],
      references: [exerciseNameVariants.id],
    }),
    name: one(exerciseNames, {
      fields: [exerciseInfo.nameId],
      references: [exerciseNames.id],
    }),
    creator: one(users, {
      fields: [exerciseInfo.creatorId],
      references: [users.id],
    }),
    exercises: many(userExercises),
    properties: many(exerciseInfoProperties),
  })
);

export type ExerciseInfoSchema = typeof exerciseInfo.$inferSelect;
export type NewExerciseInfoSchema = typeof exerciseInfo.$inferInsert;
