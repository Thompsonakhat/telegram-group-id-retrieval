export default function register(bot) {
  bot.command("help", async (ctx) => {
    console.log("[command] start", {
      command: "help",
      chatId: ctx.chat?.id,
      userId: ctx.from?.id,
    });

    const text = [
      "This bot shows the ID of the chat where you use it.",
      "",
      "Commands:",
      "/start - quick introduction",
      "/help - detailed usage",
      "/id - return the current chat ID",
      "",
      "Examples:",
      "Private chat: send /id to get your private chat ID.",
      "Group or supergroup: add the bot to that chat, then send /id there to get the group ID.",
      "",
      "Private chats return your user/private chat ID. Groups and supergroups return the group ID.",
      "",
      "If the bot does not reply in a group, Telegram group privacy settings or bot permissions may affect message delivery. Try sending the command directly in the group and check that the bot was added correctly.",
    ].join("\n");

    await ctx.reply(text);
  });
}
