import {
  pgTable,
  serial,
  varchar,
  boolean,
  text,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  trashableObjectColumns,
  createdAndUpdatedAtColumns,
} from "src/db/schema/utils/schema_helpers";
import { premiumnessConfigEnum } from "src/db/schema/types/user";
import { relations, sql } from "drizzle-orm";
import { userProfiles } from "src/db/schema/users/user_profiles";
import { userAddresses } from "src/db/schema/users/user_addresses";
import { userExercises } from "src/db/schema/exercises/user_exercises";
import { exerciseNames } from "src/db/schema/exercises/exercise_names";
import { exerciseDetails } from "src/db/schema/exercises/exercise_details";
import { exerciseVariantNames } from "src/db/schema/exercises/exercise_variant_names";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 15 }).notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isClaimed: boolean("is_claimed").default(false).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  premiumness: text("premiumness", {
    enum: [...premiumnessConfigEnum],
  })
    .default("free")
    .notNull(),
  ...createdAndUpdatedAtColumns(),
  ...trashableObjectColumns(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  addresses: many(userAddresses),
  exercises: many(userExercises),
  exerciseDetails: many(exerciseDetails),
  exerciseNames: many(exerciseNames),
  exerciseVariantNames: many(exerciseVariantNames),
}));

export type UserSchema = typeof users.$inferSelect;
export type NewUserSchema = typeof users.$inferInsert;
