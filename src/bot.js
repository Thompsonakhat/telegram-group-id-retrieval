import { Bot } from "grammy";
import { BOT_PROFILE } from "./lib/botProfile.js";

function safeErr(err) {
  return err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || String(err);
}

export function createBot(token) {
  const bot = new Bot(token);

  bot.use(async (ctx, next) => {
    try {
      const text = ctx.message?.text || "";
      if (text) {
        console.log("[update] message received", {
          updateId: ctx.update?.update_id,
          chatId: ctx.chat?.id,
          userId: ctx.from?.id,
          text,
        });
      }
      await next();
    } catch (err) {
      console.error("[update] middleware failure", {
        updateId: ctx.update?.update_id,
        chatId: ctx.chat?.id,
        userId: ctx.from?.id,
        error: safeErr(err),
      });
      throw err;
    }
  });

  bot.on("my_chat_member", async (ctx) => {
    try {
      console.log("[telegram] my_chat_member", {
        chatId: ctx.chat?.id,
        chatType: ctx.chat?.type,
        oldStatus: ctx.update.my_chat_member?.old_chat_member?.status,
        newStatus: ctx.update.my_chat_member?.new_chat_member?.status,
      });
    } catch (err) {
      console.error("[telegram] my_chat_member failure", { error: safeErr(err) });
    }
  });

  bot.command("id", async (ctx) => {
    console.log("[command] start", {
      command: "id",
      chatId: ctx.chat?.id,
      userId: ctx.from?.id,
    });
  });

  return bot;
}

export { BOT_PROFILE };
