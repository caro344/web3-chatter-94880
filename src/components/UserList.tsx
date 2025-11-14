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
    <div className="glass rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold gradient-text">Connected Users</h2>
        <span className="ml-auto text-sm text-muted-foreground">{users.length}</span>
      </div>
      
      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={user.address}
            className="flex items-center gap-3 p-3 rounded-xl glass border border-border/30 hover:border-primary/50 transition-all duration-300 animate-in fade-in-0 slide-in-from-left-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold">
                {user.address.slice(2, 4).toUpperCase()}
              </div>
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background animate-pulse" />
              )}
            </div>
            <span className="text-sm font-medium">{truncateAddress(user.address)}</span>
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Connect your wallet to join</p>
        </div>
      )}
    </div>
  );
};

export default UserList;
