import "dotenv/config";
import { BotError } from "grammy";
import { run } from "@grammyjs/runner";

function safeErr(err) {
  return err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || String(err);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

process.on("unhandledRejection", (err) => {
  console.error("[process] unhandledRejection", { error: safeErr(err) });
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("[process] uncaughtException", { error: safeErr(err) });
  process.exit(1);
});

async function boot() {
  try {
    console.log("[boot] starting", {
      telegramTokenSet: !!process.env.TELEGRAM_BOT_TOKEN,
    });

    const [{ cfg }, { createBot }, { registerCommands }] = await Promise.all([
      import("./lib/config.js"),
      import("./bot.js"),
      import("./commands/loader.js"),
    ]);

    console.log("[boot] config loaded", {
      telegramTokenSet: !!cfg.TELEGRAM_BOT_TOKEN,
    });

    if (!cfg.TELEGRAM_BOT_TOKEN) {
      console.error("TELEGRAM_BOT_TOKEN is required. Add it in your environment or .env file, then restart the bot.");
      process.exit(1);
    }

    const bot = createBot(cfg.TELEGRAM_BOT_TOKEN);
    await registerCommands(bot);

    bot.catch((err) => {
      const ctx = err.ctx;
      console.error("[telegram] bot.catch", {
        updateId: ctx?.update?.update_id,
        chatId: ctx?.chat?.id,
        userId: ctx?.from?.id,
        error: safeErr(err.error),
      });
    });

    await bot.init();

    try {
      await bot.api.setMyCommands([
        { command: "start", description: "Welcome and usage info" },
        { command: "help", description: "Show detailed help" },
        { command: "id", description: "Get the current chat ID" },
      ]);
    } catch (err) {
      console.error("[telegram] setMyCommands failed", { error: safeErr(err) });
    }

    let runner = null;
    let restartDelayMs = 2000;
    let restartLock = false;
    let cycleCount = 0;
    let lastMemLogAt = 0;

    async function startPollingLoop() {
      while (true) {
        try {
          console.log("[polling] starting", { concurrency: 1 });
          await bot.api.deleteWebhook({ drop_pending_updates: true });
          console.log("[polling] webhook cleared", { dropPendingUpdates: true });

          runner = run(bot, {
            runner: {
              fetch: {
                allowed_updates: ["message", "my_chat_member"],
              },
            },
            sink: {
              concurrency: 1,
            },
          });

          cycleCount += 1;
          console.log("[polling] cycle running", { cycle: cycleCount });

          const now = Date.now();
          if (now - lastMemLogAt >= 60000) {
            lastMemLogAt = now;
            const m = process.memoryUsage();
            console.log("[mem]", {
              rssMB: Math.round(m.rss / 1e6),
              heapUsedMB: Math.round(m.heapUsed / 1e6),
            });
          }

          await runner.task();
          console.warn("[polling] runner task exited, retrying");
        } catch (err) {
          const message = safeErr(err);
          const isConflict = String(message).includes("409") || String(message).toLowerCase().includes("conflict");
          console.error("[polling] failure", {
            error: message,
            retryInMs: restartDelayMs,
            conflict: isConflict,
          });
        } finally {
          if (runner && !restartLock) {
            restartLock = true;
            try {
              await runner.stop();
            } catch (err) {
              console.error("[polling] runner stop failed", { error: safeErr(err) });
            }
            runner = null;
            restartLock = false;
          }
        }

        await sleep(restartDelayMs);
        restartDelayMs = Math.min(restartDelayMs === 2000 ? 5000 : restartDelayMs * 2, 20000);
      }
    }

    await startPollingLoop();
  } catch (err) {
    console.error("[boot] failed", { error: safeErr(err) });
    process.exit(1);
  }
}

await boot();
