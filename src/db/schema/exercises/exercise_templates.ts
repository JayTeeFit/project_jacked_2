import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { users } from "src/db/schema/users/users";

export const exerciseTemplates = pgTable("exercise_templates", {
  id: serial("id").primaryKey(),
  exerciseNameId: integer("exercise_name_id").notNull(),
  // .references(() => exerciseTemplateNames.id, { onDelete: "cascade" }),
  creatorId: integer("creator_id").references(() => users.id, {
    onDelete: "cascade",
  }),
});
