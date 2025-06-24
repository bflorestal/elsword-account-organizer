import "server-only";
import { eq } from "drizzle-orm";
import { db } from ".";
import { accounts, characters, servers } from "./schema";

const fullCharacterFields: Record<string, boolean> = {
  class: true,
  specialization: true,
  pvpRank: true,
};

export async function getServerByName(name: string) {
  const server = await db.query.servers.findFirst({
    where: eq(servers.name, name),
  });

  if (!server) throw new Error(`Server with name ${name} not found`);

  return server;
}

export async function getAllAccounts() {
  return await db.query.accounts.findMany({
    with: {
      server: true,
      characters: {
        with: fullCharacterFields,
      },
    },
  });
}

export async function getAccountsByServerId(serverId: number) {
  const accountsList = await db.query.accounts.findMany({
    where: eq(accounts.serverId, serverId),
    with: {
      characters: true,
    },
  });

  return accountsList;
}

export async function createAccount(data: typeof accounts.$inferInsert) {
  const existingAccount = await db.query.accounts.findFirst({
    where: eq(accounts.username, data.username),
  });

  if (existingAccount)
    throw new Error(`Account with username ${data.username} already exists`);

  const [account] = await db.insert(accounts).values(data).returning();

  return account;
}

export async function getAccountById(accountId: number) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, accountId),
    with: {
      server: true,
      characters: {
        with: fullCharacterFields,
      },
    },
  });

  if (!account) throw new Error(`Account with ID ${accountId} not found`);

  return account;
}

export async function updateAccount(
  accountId: number,
  data: Partial<typeof accounts.$inferInsert>
) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, accountId),
  });

  if (!account) throw new Error(`Account with ID ${accountId} not found`);

  const [updatedAccount] = await db
    .update(accounts)
    .set(data)
    .where(eq(accounts.id, accountId))
    .returning();

  return updatedAccount;
}

export async function deleteAccount(accountId: number) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, accountId),
  });

  if (!account) throw new Error(`Account with ID ${accountId} not found`);

  return await db
    .delete(accounts)
    .where(eq(accounts.id, accountId))
    .returning();
}

export async function getCharactersByAccountId(accountId: number) {
  const chars = await db.query.characters.findMany({
    where: eq(characters.accountId, accountId),
    with: fullCharacterFields,
  });

  return chars;
}

export async function createCharacter(data: typeof characters.$inferInsert) {
  const existingCharacter = await db.query.characters.findFirst({
    where: eq(characters.username, data.username),
  });

  if (existingCharacter)
    throw new Error(`Character with username ${data.username} already exists`);

  const [character] = await db.insert(characters).values(data).returning();

  return character;
}

export async function getCharacterById(characterId: number) {
  const character = await db.query.characters.findFirst({
    where: eq(characters.id, characterId),
    with: fullCharacterFields,
  });

  if (!character) throw new Error(`Character with ID ${characterId} not found`);

  return character;
}

export async function updateCharacter(
  characterId: number,
  data: Partial<typeof characters.$inferInsert>
) {
  const character = await db.query.characters.findFirst({
    where: eq(characters.id, characterId),
  });

  if (!character) throw new Error(`Character with ID ${characterId} not found`);

  const [updatedCharacter] = await db
    .update(characters)
    .set(data)
    .where(eq(characters.id, characterId))
    .returning();

  return updatedCharacter;
}

export async function deleteCharacterById(characterId: number) {
  const character = await db.query.characters.findFirst({
    where: eq(characters.id, characterId),
  });

  if (!character) throw new Error(`Character with ID ${characterId} not found`);

  return await db
    .delete(characters)
    .where(eq(characters.id, characterId))
    .returning();
}
