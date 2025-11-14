# Web3 Chat Support System - Setup Guide

This project is a fully functional Web3 chat support system with Telegram integration.

## 🎯 Features Implemented

✅ Web3 wallet connection (MetaMask, WalletConnect, Coinbase Wallet via wagmi)
✅ Real-time chat interface with message persistence
✅ Telegram bot integration for support agents
✅ Database storage with session management
✅ WebSocket-based real-time updates
✅ Security & spam protection via RLS policies
✅ Message threading and timestamps
✅ "Support typing" indicator

## 🔧 Setup Instructions

### 1. Telegram Bot Configuration

#### Step 1: Create Your Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to name your bot
4. Copy the **Bot Token** provided (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### Step 2: Get Your Telegram Chat ID
1. Start a chat with your new bot by clicking the link BotFather provides
2. Send any message to your bot (e.g., "/start")
3. Visit this URL in your browser (replace `<YOUR_BOT_TOKEN>` with your actual token):
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
4. Look for `"chat":{"id":` in the response - copy that number (your Chat ID)

#### Step 3: Set Up Webhook
The webhook is already created in the backend. You need to register it with Telegram:

1. Visit this URL in your browser (replace the placeholders):
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://zajvpklwyuizcdhsdaif.supabase.co/functions/v1/telegram-webhook
   ```

2. You should see: `{"ok":true,"result":true,"description":"Webhook was set"}`

### 2. Add Telegram Chat ID Secret

You already added the `TELEGRAM_BOT_TOKEN` secret. Now you need to add your Chat ID:

1. Go to your backend settings (Cloud tab in Lovable)
2. Add a new secret named `TELEGRAM_CHAT_ID`
3. Enter the chat ID number you got from Step 2 above

### 3. Test the System

1. **Connect Wallet**: Click "Connect Wallet" on the website
2. **Send Message**: Type a message in the chat
3. **Check Telegram**: You should receive a notification in Telegram with the message
4. **Reply in Telegram**: Reply to the message in Telegram
5. **Check Website**: Your reply should appear on the website in real-time!

## 🏗️ Architecture

### Frontend
- **React + TypeScript** with Vite
- **wagmi** for Web3 wallet integration
- **Supabase Client** for real-time messaging
- **Tailwind CSS** for styling

### Backend (Lovable Cloud / Supabase)
- **PostgreSQL Database** with two tables:
  - `chat_sessions` - tracks wallet connections
  - `messages` - stores all messages
- **Real-time Subscriptions** via Supabase Realtime
- **Edge Functions**:
  - `send-to-telegram` - forwards user messages to Telegram
  - `telegram-webhook` - receives support replies from Telegram

### Security Features
- ✅ Row Level Security (RLS) policies
- ✅ No private key requests
- ✅ Input validation
- ✅ Secure API routes
- ✅ Chain switching error handling

## 📊 Database Schema

### chat_sessions
- `id` (UUID) - Primary key
- `wallet_address` (TEXT) - User's wallet address
- `chain_id` (INTEGER) - Network chain ID
- `session_status` (TEXT) - 'active' or 'closed'
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### messages
- `id` (UUID) - Primary key
- `session_id` (UUID) - Foreign key to chat_sessions
- `wallet_address` (TEXT) - Sender's wallet
- `message_text` (TEXT) - Message content
- `sender_type` (TEXT) - 'user' or 'support'
- `telegram_message_id` (INTEGER) - Telegram message reference
- `created_at` (TIMESTAMPTZ)

## 🔐 Environment Variables

The following are automatically configured by Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

You need to manually set:
- `TELEGRAM_BOT_TOKEN` (Already done ✅)
- `TELEGRAM_CHAT_ID` (Need to add - see Step 2 above)

## 📱 How It Works

1. **User connects wallet** → Creates/retrieves chat session
2. **User sends message** → 
   - Saved to database
   - Forwarded to your Telegram via `send-to-telegram` function
3. **You reply in Telegram** → 
   - Telegram sends webhook to `telegram-webhook` function
   - Message saved to database
   - Real-time update pushes to user's browser
4. **User sees your reply** instantly in their chat!

## 🚀 Deployment

The app is already deployed on Lovable Cloud:
- **Frontend**: Automatically deployed via Lovable
- **Backend**: Edge functions deploy automatically
- **Database**: Running on Supabase infrastructure

To publish:
1. Click "Publish" button in Lovable
2. Your app will be live with custom domain support

## 👨‍💼 Admin Features

- All messages are logged in the database
- Query messages via the Cloud dashboard
- Track connected wallets and session status
- Monitor timestamps and online status
- Export data as needed

## 🔍 Troubleshooting

### Messages not reaching Telegram?
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Verify `TELEGRAM_CHAT_ID` is set
- Check webhook is registered (visit the setWebhook URL)
- Check edge function logs in Cloud dashboard

### Replies not appearing on website?
- Ensure you're replying to the correct message in Telegram
- Check that the wallet address is extracted correctly
- Verify real-time subscription is active

### Wallet won't connect?
- Ensure you have MetaMask or compatible wallet installed
- Try refreshing the page
- Check browser console for errors

## 📞 Support

For issues or questions, check:
1. Browser console (F12)
2. Backend logs in Cloud dashboard
3. Telegram webhook status

---

Built with ❤️ using Lovable Cloud