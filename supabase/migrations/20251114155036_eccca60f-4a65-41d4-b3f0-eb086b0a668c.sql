-- Create chat_sessions table to track wallet connections and sessions
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  chain_id INTEGER,
  session_status TEXT DEFAULT 'active' CHECK (session_status IN ('active', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table to store all chat messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  message_text TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'support')),
  telegram_message_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_messages_session_id ON public.messages(session_id);
CREATE INDEX idx_messages_wallet_address ON public.messages(wallet_address);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_chat_sessions_wallet ON public.chat_sessions(wallet_address);

-- Enable Row Level Security
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_sessions - public read/write for anonymous users
CREATE POLICY "Allow public read access to chat_sessions"
  ON public.chat_sessions FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to chat_sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to chat_sessions"
  ON public.chat_sessions FOR UPDATE
  USING (true);

-- RLS Policies for messages - public read/write for anonymous users
CREATE POLICY "Allow public read access to messages"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to messages"
  ON public.messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to messages"
  ON public.messages FOR UPDATE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates on chat_sessions
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;