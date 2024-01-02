import { integer, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const trashableObjectColumns = {
  trashedAt: timestamp("trashed_at", { withTimezone: true }),
  trashedBy: integer("trashed_by"),
};

export const createdAtColumn = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
};

export const updatedAtColumn = {
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
};

export const createdAndUpdatedAtColumns = {
  ...createdAtColumn,
  ...updatedAtColumn,
};
