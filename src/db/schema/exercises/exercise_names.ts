import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  integer,
  pgTable,
  serial,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { exerciseNameVariants } from "src/db/schema/exercises/exercise_name_variants";
import { users } from "src/db/schema/users/users";

export const exerciseNames = pgTable(
  "exercise_names",
  {
    id: serial("id").primaryKey(),
    value: text("value").notNull(),
    isVerified: boolean("is_verified").default(false),
    defaultVariantId: integer("default_variant_id").references(
      (): AnyPgColumn => exerciseNameVariants.id,
      { onDelete: "set null" }
    ),
    creatorId: integer("creator_id").references(() => users.id, {
      onDelete: "cascade",
    }),
  },
  (t) => ({
    unq: unique().on(t.creatorId, t.value).nullsNotDistinct(),
  })
);

export const exerciseNamesRelations = relations(
  exerciseNames,
  ({ one, many }) => ({
    defaultVariant: one(exerciseNameVariants, {
      fields: [exerciseNames.defaultVariantId],
      references: [exerciseNameVariants.id],
      relationName: "default_variant",
    }),
    variants: many(exerciseNameVariants),
  })
);

export type ExerciseNameSchema = typeof exerciseNames.$inferSelect;
export type NewExerciseNameSchema = typeof exerciseNames.$inferInsert;
