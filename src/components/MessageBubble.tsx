import { truncateAddress } from '@/lib/web3';
import { UserCircle, Headset } from 'lucide-react';

interface MessageBubbleProps {
  address: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
  isSupport?: boolean;
}

const MessageBubble = ({ address, message, timestamp, isOwn, isSupport = false }: MessageBubbleProps) => {
  // Support on left, user on right
  const isOnLeft = isSupport;
  
  return (
    <div className={`flex flex-col ${isOnLeft ? 'items-start' : 'items-end'} mb-4`}>
      <div className="flex items-center gap-2 mb-1 px-1">
        {isSupport && <Headset className="w-3 h-3 text-accent" />}
        {!isSupport && <UserCircle className="w-3 h-3 text-muted-foreground" />}
        <span className="text-xs font-medium text-muted-foreground">
          {isSupport ? 'Support Agent' : truncateAddress(address)}
        </span>
        <span className="text-xs text-muted-foreground">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl ${
          isSupport
            ? 'bg-card border border-border text-foreground'
            : 'bg-primary text-primary-foreground'
        } shadow-glow animate-in slide-in-from-bottom-2 duration-300`}
      >
        <p className="text-sm leading-relaxed break-words">{message}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
