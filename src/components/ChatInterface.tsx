import { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { toast } from 'sonner';

interface Message {
  id: string;
  address: string;
  message: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      address,
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message sent!');
  };

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold gradient-text">Web3 Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MessageSquare className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {address ? 'No messages yet' : 'Connect your wallet to start'}
            </h3>
            <p className="text-sm text-muted-foreground/70 max-w-md">
              {address 
                ? 'Send your first message to get the conversation started!'
                : 'Connect your Web3 wallet to join the decentralized chat'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                address={msg.address}
                message={msg.message}
                timestamp={msg.timestamp}
                isOwn={msg.address === address}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-3">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={address ? "Type your message..." : "Connect wallet to chat"}
          disabled={!address}
          className="glass border-border/50 focus:border-primary transition-all duration-300"
        />
        <Button
          type="submit"
          disabled={!address || !newMessage.trim()}
          className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
