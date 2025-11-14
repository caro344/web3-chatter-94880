import { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  wallet_address: string;
  message_text: string;
  sender_type: 'user' | 'support';
  created_at: string;
}

const ChatInterface = () => {
  const { address, chain } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [supportTyping, setSupportTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize or get existing session when wallet connects
  useEffect(() => {
    if (address) {
      initializeSession();
    } else {
      setSessionId(null);
      setMessages([]);
    }
  }, [address]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          
          // Show toast for support messages
          if (newMsg.sender_type === 'support') {
            toast.success('Support agent replied!');
            setSupportTyping(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const initializeSession = async () => {
    if (!address) return;

    try {
      // Check if session exists
      const { data: existingSession, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('wallet_address', address)
        .eq('session_status', 'active')
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        return;
      }

      if (existingSession) {
        setSessionId(existingSession.id);
        loadMessages(existingSession.id);
      } else {
        // Create new session
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            wallet_address: address,
            chain_id: chain?.id,
            session_status: 'active',
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating session:', createError);
          toast.error('Failed to initialize chat session');
          return;
        }

        setSessionId(newSession.id);
        toast.success('Chat session started!');
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      toast.error('Failed to initialize chat');
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages((data || []) as Message[]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !sessionId) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!newMessage.trim()) return;

    setIsLoading(true);

    try {
      // Save message to database
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          wallet_address: address,
          message_text: newMessage.trim(),
          sender_type: 'user',
        });

      if (insertError) {
        console.error('Error saving message:', insertError);
        toast.error('Failed to send message');
        return;
      }

      // Send to Telegram
      const { error: telegramError } = await supabase.functions.invoke('send-to-telegram', {
        body: {
          walletAddress: address,
          message: newMessage.trim(),
          chainId: chain?.id,
        },
      });

      if (telegramError) {
        console.error('Error sending to Telegram:', telegramError);
        toast.warning('Message saved but failed to notify support');
      } else {
        toast.success('Message sent to support!');
        setSupportTyping(true);
        // Auto-hide typing indicator after 30 seconds
        setTimeout(() => setSupportTyping(false), 30000);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold gradient-text">Web3 Support Chat</h2>
        {address && (
          <span className="ml-auto text-xs text-muted-foreground px-3 py-1 rounded-full bg-primary/10">
            Connected
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MessageSquare className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {address ? 'Start a conversation' : 'Connect your wallet'}
            </h3>
            <p className="text-sm text-muted-foreground/70 max-w-md">
              {address 
                ? 'Send a message to get help from our support team. Replies will appear here instantly!'
                : 'Connect your Web3 wallet to start chatting with support'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                address={msg.wallet_address}
                message={msg.message_text}
                timestamp={new Date(msg.created_at)}
                isOwn={msg.sender_type === 'user'}
                isSupport={msg.sender_type === 'support'}
              />
            ))}
            {supportTyping && (
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                Support is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-3">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={address ? "Type your message..." : "Connect wallet to chat"}
          disabled={!address || isLoading}
          className="glass border-border/50 focus:border-primary transition-all duration-300"
        />
        <Button
          type="submit"
          disabled={!address || !newMessage.trim() || isLoading}
          className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;