import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { exerciseNameVariants } from "src/db/schema/exercises/exercise_name_variants";
import { users } from "src/db/schema/users/users";

export const exerciseVariantNames = pgTable(
  "exercise_variant_names",
  {
    id: serial("id").primaryKey(),
    value: text("value").notNull(),
    isVerified: boolean("is_verified").default(false),
    creatorId: integer("creator_id").references(() => users.id, {
      onDelete: "cascade",
    }),
  },
  (t) => ({
    unq: unique().on(t.creatorId, t.value).nullsNotDistinct(),
  })
);

export const exerciseVariantNamesRelations = relations(
  exerciseVariantNames,
  ({ one, many }) => ({
    nameVariants: many(exerciseNameVariants),
    creator: one(users, {
      fields: [exerciseVariantNames.creatorId],
      references: [users.id],
    }),
  })
);

export type ExerciseVariantNameSchema =
  typeof exerciseVariantNames.$inferSelect;
export type NewExerciseVariantNameSchema =
  typeof exerciseVariantNames.$inferInsert;
