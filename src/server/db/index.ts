import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

const sqlite = new Database(process.env.DB_FILE_NAME!);
export const db = drizzle({ client: sqlite, schema });

try {
  migrate(db, { migrationsFolder: "./drizzle" });
} catch (error) {
  console.error("Error migrating database:", error);
  process.exit(1);
}
