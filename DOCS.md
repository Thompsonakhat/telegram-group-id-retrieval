This bot returns the current Telegram chat ID.

It is mainly useful for identifying a group or supergroup ID for integrations and configuration.

Public commands:

1) /start
What it does: Sends a short welcome message and explains how to use the bot in private chats and groups.
Required arguments: none

2) /help
What it does: Shows more detailed usage instructions, examples, and a note about group privacy settings or permissions.
Required arguments: none

3) /id
What it does: Returns the current chat ID, the chat type label, and the chat title or name if available.
Required arguments: none

Environment variables:

1) TELEGRAM_BOT_TOKEN
What it is used for: Authenticates the bot with Telegram.
Required: yes

Setup and run:

1) Install dependencies with npm install
2) Copy .env.sample to .env
3) Set TELEGRAM_BOT_TOKEN
4) Run with npm run dev for development or npm start for normal execution

Behavior notes:

1) In a private chat, /id returns the private chat ID.
2) In a group or supergroup, /id returns the group ID.
3) If the bot does not reply in a group, Telegram privacy mode or bot permissions may affect whether the command is delivered to the bot.
