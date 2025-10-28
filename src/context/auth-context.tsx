'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from 'react';

type UserRole = 'artist' | 'buyer' | 'guest';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarId: string;
}

interface AuthContextType {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest',
  email: '',
  role: 'guest',
  avatarId: '1005',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(GUEST_USER);

  useEffect(() => {
    // This is a simple mock auth state persistence.
    const storedUser = localStorage.getItem('artify-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Import userCredentials from data.ts
    const { userCredentials, users } = await import('../lib/data');

    // Check credentials against userCredentials
    const credentials = userCredentials[email];
    if (credentials && credentials.password === password) {
      // Find the full user object
      const foundUser = users.find(u => u.email === email);
      if (foundUser) {
        const loggedInUser: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          avatarId: foundUser.avatarId,
        };
        localStorage.setItem('artify-user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('artify-user');
    setUser(GUEST_USER);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
