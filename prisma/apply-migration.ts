import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

const client = createClient({
  url: "file:./prisma/dev.db",
});

async function applyMigration() {
  console.log("📦 Applying migration...");
  
  const migrationSql = fs.readFileSync(
    path.join(__dirname, "migrations/20251227030352_init/migration.sql"),
    "utf-8"
  );
  
  // Split by ; and execute each statement
  const statements = migrationSql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));
  
  for (const statement of statements) {
    try {
      await client.execute(statement);
      console.log("✅ Executed:", statement.substring(0, 50) + "...");
    } catch (error: any) {
      console.error("❌ Error:", error.message);
    }
  }
  
  console.log("✨ Migration applied!");
}

applyMigration()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
