import { relations } from "drizzle-orm";
import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { exerciseNames } from "src/db/schema/exercises/exercise_names";
import { exerciseVariantNames } from "src/db/schema/exercises/exercise_variant_names";

export const exerciseNameVariants = pgTable("exercise_name_variants", {
  id: serial("id").primaryKey(),
  variantId: integer("variant_id")
    .references(() => exerciseVariantNames.id, {
      onDelete: "cascade",
    })
    .notNull(),
  nameId: integer("name_id")
    .references(() => exerciseNames.id, { onDelete: "cascade" })
    .notNull(),
});

export const exerciseNameVariantsRelations = relations(
  exerciseNameVariants,
  ({ one }) => ({
    name: one(exerciseNames, {
      fields: [exerciseNameVariants.nameId],
      references: [exerciseNames.id],
    }),
    variant: one(exerciseVariantNames, {
      fields: [exerciseNameVariants.variantId],
      references: [exerciseVariantNames.id],
    }),
  })
);

export type ExerciseNameVariantSchema =
  typeof exerciseNameVariants.$inferSelect;
export type NewExerciseNameVariantSchema =
  typeof exerciseNameVariants.$inferInsert;
