import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured');
    }

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL not found');
    }

    const webhookUrl = `${supabaseUrl}/functions/v1/telegram-webhook`;
    
    console.log('Setting webhook URL:', webhookUrl);

    // Set the webhook
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
        }),
      }
    );

    const result = await response.json();
    console.log('Telegram API response:', result);

    if (!result.ok) {
      throw new Error(`Failed to set webhook: ${result.description}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook configured successfully',
        webhookUrl,
        telegramResponse: result,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error setting webhook:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
