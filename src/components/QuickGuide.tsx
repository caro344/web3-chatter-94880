import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, MessageSquare, Send } from 'lucide-react';

const QuickGuide = () => {
  return (
    <Card className="glass border border-border/50 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">How It Works</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">1</span>
          </div>
          <div>
            <h4 className="font-medium mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Connect Your Wallet
            </h4>
            <p className="text-sm text-muted-foreground">
              Click "Connect Wallet" to authenticate with MetaMask or WalletConnect
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">2</span>
          </div>
          <div>
            <h4 className="font-medium mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Send a Message
            </h4>
            <p className="text-sm text-muted-foreground">
              Type your question or issue in the chat box
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">3</span>
          </div>
          <div>
            <h4 className="font-medium mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-accent" />
              Get Real-Time Support
            </h4>
            <p className="text-sm text-muted-foreground">
              Your message is forwarded to our Telegram. Replies appear here instantly!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Pro Tip:</strong> All your messages are saved. You can reconnect anytime to continue your conversation!
        </p>
      </div>
    </Card>
  );
};

export default QuickGuide;