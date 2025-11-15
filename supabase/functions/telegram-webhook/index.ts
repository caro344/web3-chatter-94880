import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Webhook called - method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const update = await req.json();
    console.log('Received Telegram update:', JSON.stringify(update, null, 2));

    // Handle incoming message from Telegram (support agent reply)
    if (update.message && update.message.text) {
      const telegramMessage = update.message;
      
      // Extract wallet address from reply_to_message or use command format
      let walletAddress = null;
      
      // If this is a reply to a previous message, extract wallet from it
      if (telegramMessage.reply_to_message?.text) {
        // Match wallet address with or without backticks (Telegram code formatting)
        const match = telegramMessage.reply_to_message.text.match(/Wallet: `?(0x[a-fA-F0-9]{40})`?/);
        if (match) {
          walletAddress = match[1];
          console.log('Extracted wallet address:', walletAddress);
        } else {
          console.log('Could not extract wallet from reply:', telegramMessage.reply_to_message.text);
        }
      }

      if (!walletAddress) {
        console.log('No wallet address found in reply');
        return new Response(JSON.stringify({ ok: true, message: 'No wallet address found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Find the session for this wallet
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('wallet_address', walletAddress)
        .eq('session_status', 'active')
        .single();

      if (sessionError || !session) {
        console.error('Session not found:', sessionError);
        return new Response(JSON.stringify({ ok: true, message: 'Session not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Save support reply to database
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          session_id: session.id,
          wallet_address: walletAddress,
          message_text: telegramMessage.text,
          sender_type: 'support',
          telegram_message_id: telegramMessage.message_id,
        });

      if (insertError) {
        console.error('Error inserting message:', insertError);
        throw insertError;
      }

      console.log('Support reply saved successfully');
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in telegram-webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});