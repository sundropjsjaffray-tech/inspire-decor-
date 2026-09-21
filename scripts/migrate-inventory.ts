import { readFile } from "node:fs/promises";
import { sql } from "~/db";

const migration = await readFile(new URL("../migrations/001_inventory.sql", import.meta.url), "utf8");
const query = sql();
await query.unsafe(migration);
console.log("Applied inventory migration 001_inventory.sql");
