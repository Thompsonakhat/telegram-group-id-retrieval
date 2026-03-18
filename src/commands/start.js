function getChatIdMessage(ctx) {
  const chatId = String(ctx.chat?.id || "unknown");
  const chatType = ctx.chat?.type || "unknown";
  const title = ctx.chat?.title || [ctx.chat?.first_name, ctx.chat?.last_name].filter(Boolean).join(" ") || "";

  const lines = [
    "Chat ID: " + chatId,
    "Chat type: " + chatType,
  ];

  if (title) {
    lines.push("Name: " + title);
  }

  if (chatType === "private") {
    lines.push("This is your private chat ID.");
  } else if (chatType === "group" || chatType === "supergroup") {
    lines.push("This is the group ID.");
  }

  return lines.join("\n");
}

export default function register(bot) {
  bot.command("start", async (ctx) => {
    console.log("[command] start", {
      command: "start",
      chatId: ctx.chat?.id,
      userId: ctx.from?.id,
    });

    const text = [
      "Hi, I can show you the current Telegram chat ID.",
      "",
      "In a private chat, use /id to get your private chat ID.",
      "In a group or supergroup, add me to the target chat and send /id there to get that group ID.",
    ].join("\n");

    if (ctx.chat?.type === "private") {
      await ctx.reply(text + "\n\n" + getChatIdMessage(ctx));
      return;
    }

    await ctx.reply(text);
  });
}
