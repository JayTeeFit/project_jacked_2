import { integer, serial, text, timestamp } from "drizzle-orm/pg-core";
import { dataTypesEnum } from "src/db/schema/types/dynamic_properties";

export const trashableObjectColumns = () => ({
  trashedAt: timestamp("trashed_at", { withTimezone: true }),
  trashedBy: integer("trashed_by"),
});

export const createdAtColumn = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const updatedAtColumn = () => ({
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const createdAndUpdatedAtColumns = () => ({
  ...createdAtColumn(),
  ...updatedAtColumn(),
});

export const listOrderColumn = () => ({
  listOrder: integer("list_order").notNull(),
});

export const dynamicPropertiesSchema = () => ({
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  dataType: text("data_type", { enum: dataTypesEnum }).notNull(),
});
