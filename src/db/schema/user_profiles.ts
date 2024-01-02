import { relations } from "drizzle-orm";
import { pgTable, serial, varchar, integer, text } from "drizzle-orm/pg-core";
import { users } from "src/db/schema/users";
import { updatedAtColumn } from "src/db/schema/utils/schema_helpers";

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  aboutMe: text("about_me"),
  ...updatedAtColumn,
});
