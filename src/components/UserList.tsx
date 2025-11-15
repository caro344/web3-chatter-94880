import { Users } from 'lucide-react';
import { truncateAddress } from '@/lib/web3';

interface User {
  address: string;
  isOnline: boolean;
}

interface UserListProps {
  users: User[];
}

const UserList = ({ users }: UserListProps) => {
  return (
    <div className="glass rounded-2xl p-4 md:p-6 border border-border/50 h-full">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        <h2 className="text-base md:text-lg font-bold gradient-text">Active Users</h2>
        <span className="ml-auto text-xs md:text-sm text-muted-foreground">{users.length}</span>
      </div>
      
      <div className="space-y-2 md:space-y-3">
        {users.map((user, index) => (
          <div
            key={user.address}
            className="flex items-center gap-3 p-2 md:p-3 rounded-xl glass border border-border/30 hover:border-primary/50 transition-all duration-300 animate-in fade-in-0 slide-in-from-left-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs md:text-sm font-bold">
                {user.address.slice(2, 4).toUpperCase()}
              </div>
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-background animate-pulse" />
              )}
            </div>
            <span className="text-xs md:text-sm font-medium">{truncateAddress(user.address)}</span>
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <Users className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-xs md:text-sm">Connect your wallet to join</p>
        </div>
      )}
    </div>
  );
};

export default UserList;
