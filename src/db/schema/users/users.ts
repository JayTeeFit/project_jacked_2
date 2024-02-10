import { pgTable, serial, varchar, boolean, text } from "drizzle-orm/pg-core";
import {
  trashableObjectColumns,
  createdAndUpdatedAtColumns,
} from "src/db/schema/utils/schema_helpers";
import { premiumnessConfigEnum } from "src/db/schema/types/user";
import { relations } from "drizzle-orm";
import { userProfiles, userAddresses } from "src/db/schema/users";
import {
  userExercises,
  exerciseNames,
  exerciseDetails,
  exerciseVariantNames,
} from "src/db/schema/exercises";
import { routineDetails, userRoutines } from "src/db/schema/routines";
import { userTrainingDays } from "src/db/schema/training_days";

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
  routines: many(userRoutines),
  routineDetails: many(routineDetails),
  userTrainingDays: many(userTrainingDays),
}));

export type UserSchema = typeof users.$inferSelect;
export type NewUserSchema = typeof users.$inferInsert;
