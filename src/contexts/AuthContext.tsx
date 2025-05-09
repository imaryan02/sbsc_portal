import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { UserRole } from '@/lib/types';
import { mockDataService, switchUserRole } from '@/lib/services/mockDataService';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: any;
  session: any;
  userRole: UserRole | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
  switchRole: (role: UserRole) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshUserRole = async () => {
    if (!user) return;
    setUserRole(user.role);
  };

  const switchRole = (role: UserRole) => {
    const newUser = switchUserRole(role);
    setUser(newUser);
    setUserRole(role);
    localStorage.setItem('mockUserRole', role);
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const savedRole = localStorage.getItem('mockUserRole') as UserRole | null;
        const currentUser = savedRole
          ? switchUserRole(savedRole)
          : mockDataService.getCurrentUser();

        if (currentUser) {
          setUser(currentUser);
          setSession({ user: currentUser });
          setUserRole(currentUser.role);

          toast({
            title: 'Mock Authentication',
            description: `Logged in as ${currentUser.name} (${currentUser.role})`,
          });
        }
      } catch (error) {
        console.error('Error setting up auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();
  }, []);

  const signOut = async () => {
    await mockDataService.logout();
    setUser(null);
    setSession(null);
    setUserRole(null);
    localStorage.removeItem('mockUserRole');

    toast({
      title: 'Logged out',
      description: 'You have been logged out of the system.',
    });

    // 🚫 Do NOT use navigate here — let caller handle redirection
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        isLoading,
        signOut,
        refreshUserRole,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
