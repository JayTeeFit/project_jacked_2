import { pgTable, serial, varchar, integer, index } from "drizzle-orm/pg-core";
import { users } from "src/db/schema/users";
import {
  trashableObjectColumns,
  createdAndUpdatedAtColumns,
} from "src/db/schema/utils/schema_helpers";
import { addressTypeConfigEnum } from "src/db/schema/types/address";
import { relations } from "drizzle-orm";

export const userAddresses = pgTable("user_addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  unitNumber: varchar("unit_number", { length: 16 }),
  streetNumber: varchar("street_number", { length: 32 }),
  streetName: varchar("street_name", { length: 50 }),
  city: varchar("city", { length: 50 }),
  country: varchar("country", { length: 50 }),
  postal: varchar("postal", { length: 12 }),
  type: varchar("type", {
    length: 16,
    enum: [...addressTypeConfigEnum],
  }).notNull(),
  ...createdAndUpdatedAtColumns,
  ...trashableObjectColumns,
});

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

export type UserAddress = typeof userAddresses.$inferSelect;
export type NewUserAddress = typeof userAddresses.$inferInsert;
