import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, Bot } from 'lucide-react';
import logo from '@/assets/logo.png';

const Verify = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Check if already verified
    const isVerified = localStorage.getItem('humanVerified');
    if (isVerified === 'true') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleVerify = () => {
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setVerified(true);
      localStorage.setItem('humanVerified', 'true');
      
      // Navigate to main site after short delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Verification Card */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
              verified 
                ? 'bg-green-500/20 border-2 border-green-500' 
                : 'bg-secondary border-2 border-border'
            }`}>
              {verified ? (
                <CheckCircle className="w-10 h-10 text-green-500 animate-scale-in" />
              ) : isVerifying ? (
                <Shield className="w-10 h-10 text-foreground animate-pulse" />
              ) : (
                <Bot className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-2">
            {verified ? 'Verified!' : 'Human Verification'}
          </h1>
          
          {/* Subtitle */}
          <p className="text-muted-foreground text-center text-sm mb-8">
            {verified 
              ? 'Redirecting to the main site...' 
              : 'Please verify that you are human to access our platform'
            }
          </p>

          {/* Verify Button */}
          {!verified && (
            <Button
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full bg-foreground text-background hover:bg-foreground/90 py-6 text-base font-medium rounded-xl"
              size="lg"
            >
              {isVerifying ? (
                <>
                  <Shield className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Verify I'm Human
                </>
              )}
            </Button>
          )}

          {/* Security Note */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            This verification helps protect our platform from bots and automated access.
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Powered by Web3 • Secure • Decentralized
        </p>
      </div>
    </div>
  );
};

export default Verify;
