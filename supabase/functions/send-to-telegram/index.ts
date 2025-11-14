import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramRequest {
  walletAddress: string;
  message: string;
  chainId?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { walletAddress, message, chainId }: TelegramRequest = await req.json();
    
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured');
    }

    // You need to get your Telegram chat ID - start a chat with your bot and send /start
    // Then use https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates to get your chat_id
    // For now, we'll send to the first available chat or you can hardcode your chat ID
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    
    if (!chatId) {
      console.error('TELEGRAM_CHAT_ID not set. Please set your Telegram chat ID.');
      throw new Error('TELEGRAM_CHAT_ID not configured');
    }

    const telegramMessage = `
🔔 *New Support Message*

*Wallet:* \`${walletAddress}\`
*Chain ID:* ${chainId || 'Unknown'}

*Message:*
${message}

_Reply to this message to respond to the user_
    `.trim();

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'Markdown',
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', result);
      throw new Error(`Telegram API error: ${JSON.stringify(result)}`);
    }

    console.log('Message sent to Telegram successfully:', result);

    return new Response(JSON.stringify({ 
      success: true, 
      telegram_message_id: result.result.message_id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in send-to-telegram:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});