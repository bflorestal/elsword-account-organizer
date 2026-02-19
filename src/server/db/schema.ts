import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTableCreator,
  serial,
  text,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `elstracker_${name}`);

export const servers = createTable("servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const serversRelations = relations(servers, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable("accounts", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id")
    .notNull()
    .references(() => servers.id, { onDelete: "cascade" }),
  username: text("username").notNull(),
  isSteam: boolean("is_steam").default(false),
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
  id: serial("id").primaryKey(),
  accountId: integer("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  classId: integer("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  username: text("name").notNull(),
  level: integer("level").default(1),
  specializationId: integer("specialization_id").references(
    () => specializations.id,
    { onDelete: "set null" },
  ),
  pvpRankId: integer("pvp_rank_id").references(() => pvpRanks.id, {
    onDelete: "set null",
  }),
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
  pvpRank: one(pvpRanks, {
    fields: [characters.pvpRankId],
    references: [pvpRanks.id],
  }),
}));

export const classes = createTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  iconUrl: text("icon_url").notNull(),
});

export const classesRelations = relations(classes, ({ many }) => ({
  characters: many(characters),
  specializations: many(specializations),
}));

export const specializations = createTable("specializations", {
  id: serial("id").primaryKey(),
  classId: integer("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  name: text("name").notNull().unique(),
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
  }),
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
  id: serial("id").primaryKey(),
  name: text("name", { enum: pvpRanksEnum }).notNull().unique(),
  iconUrl: text("icon_url"),
});

export const pvpRanksRelations = relations(pvpRanks, ({ many }) => ({
  characters: many(characters),
}));
