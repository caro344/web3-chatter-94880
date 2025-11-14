# Web3 Chat Support System

A fully functional Web3 chat support platform with Telegram integration. Users connect their crypto wallet and chat live with support agents. All messages are forwarded to Telegram, and replies from Telegram are sent back to users in real-time.

## Project info

**URL**: https://lovable.dev/projects/66ffbe71-111c-42ec-8cdb-5432fe17e0be

## 🎯 Key Features

- **Web3 Wallet Integration**: MetaMask, WalletConnect, Coinbase Wallet support via wagmi
- **Real-Time Chat**: WebSocket-based instant messaging
- **Telegram Integration**: Bidirectional communication with Telegram bot
- **Session Management**: Unique sessions per wallet with full history
- **Security**: RLS policies, input validation, no private key requests
- **Database Persistence**: All messages and sessions stored in PostgreSQL
- **Support Typing Indicator**: Shows when support is typing
- **Beautiful UI**: Modern, responsive design with dark mode

## 📋 Setup Instructions

**IMPORTANT**: See [SETUP.md](SETUP.md) for complete setup instructions including:
- Creating your Telegram bot
- Getting your Telegram Chat ID
- Configuring webhooks
- Testing the system

Quick start:
1. You've already added `TELEGRAM_BOT_TOKEN` ✅
2. You've already added `TELEGRAM_CHAT_ID` ✅
3. Set up Telegram webhook (see SETUP.md)
4. Start chatting!

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/66ffbe71-111c-42ec-8cdb-5432fe17e0be) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/66ffbe71-111c-42ec-8cdb-5432fe17e0be) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
