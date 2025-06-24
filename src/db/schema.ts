import { relations } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `elstracker_${name}`);

export const servers = createTable("servers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const serversRelations = relations(servers, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serverId: integer("server_id")
    .notNull()
    .references(() => servers.id),
  username: text("username").notNull(),
  isSteam: integer("is_steam", { mode: "boolean" }).default(false),
  resonanceLevel: integer("resonance_level").default(0),
});

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  server: one(servers, {
    fields: [accounts.serverId],
    references: [servers.id],
  }),
  characters: many(characters),
}));

export const characters = createTable("characters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  accountId: integer("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  classId: integer("class_id")
    .notNull()
    .references(() => classes.id),
  username: text("name").notNull(),
  level: integer("level").default(1),
  specializationId: integer("specialization_id").references(
    () => specializations.id
  ),
  pvpRankId: integer("pvp_rank_id")
    .notNull()
    .references(() => pvpRanks.id),
});

export const charactersRelations = relations(characters, ({ one }) => ({
  account: one(accounts, {
    fields: [characters.accountId],
    references: [accounts.id],
  }),
  class: one(classes, {
    fields: [characters.classId],
    references: [classes.id],
  }),
  specialization: one(specializations, {
    fields: [characters.specializationId],
    references: [specializations.id],
  }),
}));

export const classes = createTable("classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  iconUrl: text("icon_url").notNull(),
});

export const classesRelations = relations(classes, ({ many }) => ({
  characters: many(characters),
  specializations: many(specializations),
}));

export const specializations = createTable("specializations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  classId: integer("class_id")
    .notNull()
    .references(() => classes.id),
  name: text("name").notNull(),
  iconUrl: text("icon_url").notNull(),
});

export const specializationsRelations = relations(
  specializations,
  ({ one, many }) => ({
    characters: many(characters),
    class: one(classes, {
      fields: [specializations.classId],
      references: [classes.id],
    }),
  })
);

export const pvpRanksEnum = [
  "Unranked",
  "E",
  "D",
  "C",
  "B",
  "A",
  "S",
  "SS",
  "SSS",
  "Star",
] as const;

export const pvpRanks = createTable("pvp_ranks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { enum: pvpRanksEnum }).notNull(),
  iconUrl: text("icon_url"),
});

export const pvpRanksRelations = relations(pvpRanks, ({ many }) => ({
  characters: many(characters),
}));
