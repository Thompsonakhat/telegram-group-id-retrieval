import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

function safeErr(err) {
  return err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || String(err);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerCommands(bot) {
  const commandFiles = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith(".js") && file !== "loader.js" && !file.startsWith("_"))
    .sort();

  for (const file of commandFiles) {
    try {
      const mod = await import(pathToFileURL(path.join(__dirname, file)).href);
      const handler = mod.default || mod.register;
      if (typeof handler === "function") {
        await handler(bot);
      }
    } catch (err) {
      console.error("[commands] register failed", {
        file,
        error: safeErr(err),
      });
      throw err;
    }
  }
}
