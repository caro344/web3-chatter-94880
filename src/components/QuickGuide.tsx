import { Wallet, MessageCircle, Zap } from 'lucide-react';
import { Card } from './ui/card';

const QuickGuide = () => {
  const steps = [
    {
      icon: Wallet,
      title: 'Connect Wallet',
      description: 'Click the connect button to link your Web3 wallet',
    },
    {
      icon: MessageCircle,
      title: 'Start Chatting',
      description: 'Send messages and get instant support responses',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Receive live notifications when support responds',
    },
  ];

  return (
    <div className="glass rounded-2xl p-4 md:p-8 border border-border/50 shadow-glow">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2 md:mb-3">
          Get Started in 3 Simple Steps
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Connect your wallet and start chatting with our support team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={index}
              className="glass p-4 md:p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3 md:mb-4">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickGuide;
