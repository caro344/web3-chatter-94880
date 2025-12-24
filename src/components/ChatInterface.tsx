import { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAppKitAccount } from '@reown/appkit/react';
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
  const { address: evmAddress, chain } = useAccount();
  const { address: appKitAddress } = useAppKitAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [supportTyping, setSupportTyping] = useState(false);
  const [nonEvmWallet, setNonEvmWallet] = useState<{ address: string; type: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for non-EVM wallet on mount and listen for changes
  useEffect(() => {
    const checkNonEvmWallet = () => {
      const stored = localStorage.getItem('nonEvmWallet');
      if (stored) {
        try {
          setNonEvmWallet(JSON.parse(stored));
        } catch {
          setNonEvmWallet(null);
        }
      } else {
        setNonEvmWallet(null);
      }
    };

    checkNonEvmWallet();
    window.addEventListener('storage', checkNonEvmWallet);
    return () => window.removeEventListener('storage', checkNonEvmWallet);
  }, []);

  const address = appKitAddress || evmAddress || nonEvmWallet?.address;

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
    if (!address || !newMessage.trim() || !sessionId) return;

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
        console.error('Error inserting message:', insertError);
        toast.error('Failed to send message');
        return;
      }

      // Send to support backend
      const { error: supportError } = await supabase.functions.invoke('send-to-telegram', {
        body: {
          walletAddress: address,
          message: newMessage.trim(),
          chainId: chain?.id,
        },
      });

      if (supportError) {
        console.error('Error notifying support:', supportError);
        toast.warning('Message saved but support notification failed');
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
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="glass rounded-t-2xl p-4 md:p-6 border border-border/50 border-b-0 shadow-glow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-bold text-foreground">Live Support Chat</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              {address ? 'Connected and ready to chat' : 'Connect your wallet to start'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 glass rounded-b-2xl border border-border/50 border-t-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 md:py-12">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <p className="text-base md:text-lg font-medium text-muted-foreground text-center px-4">
                {address ? 'Start a conversation' : 'Connect your wallet to begin chatting'}
              </p>
              {address && (
                <p className="text-xs md:text-sm text-muted-foreground/70 mt-2 text-center px-4">
                  Your messages will receive real-time support responses
                </p>
              )}
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  address={msg.wallet_address}
                  message={msg.message_text}
                  timestamp={new Date(msg.created_at)}
                  isOwn={msg.wallet_address === address}
                  isSupport={msg.sender_type === 'support'}
                />
              ))}
              
              {/* Support Typing Indicator */}
              {supportTyping && (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground animate-in fade-in duration-300">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Support is responding...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        {address && (
          <div className="border-t border-border/50 p-3 md:p-4 bg-card/50">
            <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 glass border-border/50 focus:border-primary transition-colors text-sm md:text-base"
              />
              <Button
                type="submit"
                disabled={!newMessage.trim() || isLoading}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity px-4 md:px-6 h-10 md:h-11"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
                <span className="ml-2 hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
