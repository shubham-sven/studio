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
  login: (role: 'artist' | 'buyer') => void;
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

  const login = (role: 'artist' | 'buyer') => {
    const loggedInUser: User = {
      id: 'user-123',
      name: role === 'artist' ? 'Arturo Picasso' : 'Casey Buyer',
      email:
        role === 'artist' ? 'arturo@example.com' : 'casey@example.com',
      role,
      avatarId: role === 'artist' ? '1025' : '1015',
    };
    localStorage.setItem('artify-user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
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
