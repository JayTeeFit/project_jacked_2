import { pgTable, serial, varchar, boolean, text } from "drizzle-orm/pg-core";
import {
  trashableObjectColumns,
  createdAndUpdatedAtColumns,
} from "src/db/schema/utils/schema_helpers";
import { premiumnessConfigEnum } from "src/db/schema/types/user";
import { relations } from "drizzle-orm";
import { userProfiles } from "src/db/schema/users/user_profiles";
import { userAddresses } from "src/db/schema/users/user_addresses";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 15 }).unique().notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  isActive: boolean("is_active").default(true),
  isClaimed: boolean("is_claimed").default(false),
  isAdmin: boolean("is_admin").default(false),
  premiumness: text("premiumness", {
    enum: [...premiumnessConfigEnum],
  })
    .notNull()
    .default("free"),
  ...createdAndUpdatedAtColumns,
  ...trashableObjectColumns,
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  addresses: many(userAddresses),
}));

export type UserSchema = typeof users.$inferSelect;
export type NewUserSchema = typeof users.$inferInsert;
