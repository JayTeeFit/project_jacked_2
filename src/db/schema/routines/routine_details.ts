import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { routineDetailProperties } from "src/db/schema/routines/routine_detail_properties";
import { users } from "src/db/schema/users/users";
import { userRoutines } from "src/db/schema/routines/user_routines";
import {
  trashableObjectColumns,
  createdAndUpdatedAtColumns,
} from "src/db/schema/utils/schema_helpers";

export const routineDetails = pgTable("routine_details", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("name"),
  creatorId: integer("creator_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  ...createdAndUpdatedAtColumns(),
  ...trashableObjectColumns(),
});

export const routineDetailsRelations = relations(
  routineDetails,
  ({ one, many }) => ({
    properties: many(routineDetailProperties),
    routines: many(userRoutines),
    creator: one(users, {
      fields: [routineDetails.id],
      references: [users.id],
    }),
  })
);

export type RoutineDetailSchema = typeof routineDetails.$inferSelect;
export type NewRoutineDetailSchema = typeof routineDetails.$inferInsert;
