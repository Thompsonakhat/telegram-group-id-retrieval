# Chat Id Bot

A small Telegram bot built with Node.js, ES modules, and grammY.

It helps users retrieve the current Telegram chat ID in private chats, groups, and supergroups.

## Features

- `/start` welcome and quick usage guidance
- `/help` more detailed instructions and examples
- `/id` returns the current chat ID, chat type, and name/title when available
- production-safe logging
- single-process deployment

## Architecture

- `src/index.js` boots the app and starts Telegram long polling with `@grammyjs/runner`
- `src/bot.js` creates the grammY bot and shared middleware
- `src/commands/*.js` contains command handlers
- `src/lib/config.js` reads environment variables
- `src/lib/botProfile.js` stores runtime bot profile metadata

## Setup

Prerequisites:

- Node.js 18+
- A Telegram bot token from BotFather

Install:

bash
npm install


Configure env:

bash
cp .env.sample .env


Set:

- `TELEGRAM_BOT_TOKEN`: your Telegram bot token

Run locally:

bash
npm run dev


Start normally:

bash
npm start


Build:

bash
npm run build


## Commands

### /start
Shows a short welcome message and explains how to use the bot in private chats and groups.

Example:

text
/start


### /help
Shows detailed usage instructions, examples, and notes about group privacy settings.

Example:

text
/help


### /id
Returns the current chat ID, chat type, and title/name when available.

Examples:

text
/id


Expected output in private chat:

text
Chat ID: 123456789
Chat type: private
Name: Jane Doe
This is the private chat ID.


Expected output in group:

text
Chat ID: -1001234567890
Chat type: supergroup
Name: My Group
This is the group ID.


## Integrations

This bot only uses the Telegram Bot API through grammY.

No external business APIs, no AI gateway, and no non-Telegram platform integrations are included.

## Database

No database is used by this bot.

## Deployment

For Render or similar platforms:

1. Create a Node service
2. Set `TELEGRAM_BOT_TOKEN`
3. Use build command: `npm run build`
4. Use start command: `npm start`

The bot uses long polling and runs as a single Node.js process.

## Troubleshooting

- If the bot does not start, confirm `TELEGRAM_BOT_TOKEN` is set
- If the bot does not reply in a group, check Telegram group privacy settings and ensure the bot was added correctly
- Check logs for startup, polling, and command handling messages

## Extensibility

Add new commands in `src/commands/` and they will be loaded by `src/commands/loader.js`.

If you add public commands, also update the Telegram command menu in `src/index.js` and the help text.
