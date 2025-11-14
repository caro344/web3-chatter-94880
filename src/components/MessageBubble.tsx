import { truncateAddress } from '@/lib/web3';

interface MessageBubbleProps {
  address: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

const MessageBubble = ({ address, message, timestamp, isOwn }: MessageBubbleProps) => {
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-4`}>
      <div className="flex items-center gap-2 mb-1 px-1">
        <span className="text-xs text-muted-foreground">{truncateAddress(address)}</span>
        <span className="text-xs text-muted-foreground">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl ${
          isOwn
            ? 'bg-gradient-to-br from-primary to-accent text-white shadow-glow'
            : 'glass border border-border/50'
        } animate-in slide-in-from-bottom-2 duration-300`}
      >
        <p className="text-sm leading-relaxed break-words">{message}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
