function safeErr(err) {
  return err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || String(err);
}

function chatTypeLabel(type) {
  if (type === "private") return "private";
  if (type === "group") return "group";
  if (type === "supergroup") return "supergroup";
  return type || "unknown";
}

function chatDisplayName(chat) {
  if (!chat) return "";
  return chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(" ") || "";
}

function formatIdReply(ctx) {
  const chatId = String(ctx.chat?.id || "unknown");
  const type = chatTypeLabel(ctx.chat?.type);
  const name = chatDisplayName(ctx.chat);

  const lines = [
    "Chat ID: " + chatId,
    "Chat type: " + type,
  ];

  if (name) {
    lines.push("Name: " + name);
  }

  if (type === "private") {
    lines.push("This is the private chat ID.");
  } else if (type === "group" || type === "supergroup") {
    lines.push("This is the group ID.");
  }

  return lines.join("\n");
}

export default function register(bot) {
  const handler = async (ctx) => {
    try {
      console.log("[command] start", {
        command: "id",
        chatId: ctx.chat?.id,
        userId: ctx.from?.id,
        chatType: ctx.chat?.type,
      });

      await ctx.reply(formatIdReply(ctx));

      console.log("[command] success", {
        command: "id",
        chatId: ctx.chat?.id,
        userId: ctx.from?.id,
      });
    } catch (err) {
      console.error("[command] failure", {
        command: "id",
        chatId: ctx.chat?.id,
        userId: ctx.from?.id,
        error: safeErr(err),
      });
      await ctx.reply("Sorry, I could not read this chat ID right now.");
    }
  };

  bot.command("id", handler);
}
