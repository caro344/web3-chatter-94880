import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, Bot, MousePointer, Fingerprint, Eye } from 'lucide-react';
import logo from '@/assets/logo.png';

interface Challenge {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
}

const Verify = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 'click', label: 'Click Verification', icon: <MousePointer className="w-4 h-4" />, completed: false },
    { id: 'hold', label: 'Hold to Verify', icon: <Fingerprint className="w-4 h-4" />, completed: false },
    { id: 'track', label: 'Movement Check', icon: <Eye className="w-4 h-4" />, completed: false },
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [mouseMovements, setMouseMovements] = useState(0);

  useEffect(() => {
    const isVerified = localStorage.getItem('humanVerified');
    if (isVerified === 'true') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Track mouse and touch movements for human verification
  useEffect(() => {
    const handleMovement = () => {
      setMouseMovements(prev => {
        const newCount = prev + 1;
        if (newCount >= 10 && !challenges.find(c => c.id === 'track')?.completed) {
          setChallenges(prev => prev.map(c => 
            c.id === 'track' ? { ...c, completed: true } : c
          ));
        }
        return newCount;
      });
    };

    window.addEventListener('mousemove', handleMovement);
    window.addEventListener('touchmove', handleMovement);
    window.addEventListener('touchstart', handleMovement);
    
    return () => {
      window.removeEventListener('mousemove', handleMovement);
      window.removeEventListener('touchmove', handleMovement);
      window.removeEventListener('touchstart', handleMovement);
    };
  }, [challenges]);

  // Hold button logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding && holdProgress < 100) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            setChallenges(prev => prev.map(c => 
              c.id === 'hold' ? { ...c, completed: true } : c
            ));
            setIsHolding(false);
          }
          return Math.min(newProgress, 100);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isHolding, holdProgress]);

  const handleClickChallenge = () => {
    setChallenges(prev => prev.map(c => 
      c.id === 'click' ? { ...c, completed: true } : c
    ));
  };

  const allChallengesCompleted = challenges.every(c => c.completed);

  const handleFinalVerify = useCallback(() => {
    if (!allChallengesCompleted) return;
    
    setIsVerifying(true);
    setTimeout(() => {
      setVerified(true);
      localStorage.setItem('humanVerified', 'true');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    }, 1500);
  }, [allChallengesCompleted, navigate]);

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
          {/* Logo - Increased size */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-32 h-32 sm:w-40 sm:h-40 object-contain" />
          </div>

          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
              verified 
                ? 'bg-green-500/20 border-2 border-green-500' 
                : 'bg-secondary border-2 border-border'
            }`}>
              {verified ? (
                <CheckCircle className="w-8 h-8 text-green-500 animate-scale-in" />
              ) : isVerifying ? (
                <Shield className="w-8 h-8 text-foreground animate-pulse" />
              ) : (
                <Bot className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-2">
            {verified ? 'Verified!' : 'Human Verification'}
          </h1>
          
          {/* Subtitle */}
          <p className="text-muted-foreground text-center text-sm mb-6">
            {verified 
              ? 'Redirecting to the main site...' 
              : 'Complete all security challenges to access our platform'
            }
          </p>

          {/* Security Challenges */}
          {!verified && (
            <div className="space-y-4 mb-6">
              {/* Challenge Progress */}
              <div className="flex justify-center gap-2 mb-4">
                {challenges.map((challenge) => (
                  <div 
                    key={challenge.id}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      challenge.completed 
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                        : 'bg-secondary text-muted-foreground border border-border'
                    }`}
                  >
                    {challenge.completed ? <CheckCircle className="w-3 h-3" /> : challenge.icon}
                    <span className="hidden sm:inline">{challenge.label}</span>
                  </div>
                ))}
              </div>

              {/* Challenge 1: Click Verification */}
              {!challenges.find(c => c.id === 'click')?.completed && (
                <Button
                  onClick={handleClickChallenge}
                  variant="outline"
                  className="w-full py-5 border-dashed border-2 hover:border-solid hover:border-foreground/50"
                >
                  <MousePointer className="w-4 h-4 mr-2" />
                  Click Here to Start Verification
                </Button>
              )}

              {/* Challenge 2: Hold Button */}
              {challenges.find(c => c.id === 'click')?.completed && 
               !challenges.find(c => c.id === 'hold')?.completed && (
                <div className="space-y-2">
                  <Button
                    onMouseDown={() => setIsHolding(true)}
                    onMouseUp={() => setIsHolding(false)}
                    onMouseLeave={() => setIsHolding(false)}
                    onTouchStart={() => setIsHolding(true)}
                    onTouchEnd={() => setIsHolding(false)}
                    variant="outline"
                    className="w-full py-5 border-2 relative overflow-hidden"
                  >
                    <div 
                      className="absolute left-0 top-0 h-full bg-foreground/10 transition-all"
                      style={{ width: `${holdProgress}%` }}
                    />
                    <span className="relative z-10 flex items-center">
                      <Fingerprint className="w-4 h-4 mr-2" />
                      Hold for 2 Seconds ({Math.round(holdProgress)}%)
                    </span>
                  </Button>
                </div>
              )}

              {/* Challenge 3: Mouse Movement - shows progress */}
              {challenges.find(c => c.id === 'click')?.completed && 
               challenges.find(c => c.id === 'hold')?.completed &&
               !challenges.find(c => c.id === 'track')?.completed && (
                <div className="text-center p-4 border border-dashed border-border rounded-xl">
                  <Eye className="w-6 h-6 mx-auto mb-2 text-muted-foreground animate-pulse" />
                  <p className="text-sm text-muted-foreground">
                    Move your mouse or touch the screen ({Math.min(mouseMovements, 10)}/10)
                  </p>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div 
                      className="bg-foreground h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(mouseMovements * 10, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Final Verify Button */}
          {!verified && allChallengesCompleted && (
            <Button
              onClick={handleFinalVerify}
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
                  Complete Verification
                </>
              )}
            </Button>
          )}

          {/* Security Note */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Multi-factor human verification protects our platform from bots and automated access.
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