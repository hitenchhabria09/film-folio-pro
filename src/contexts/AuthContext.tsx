import React, { createContext, useContext, useState, useEffect } from 'react';
import { simpleJWT } from '@/utils/jwt';

interface User {
  id: string;
  email: string;
  name: string;
  favorites: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  addToFavorites: (movieId: string) => void;
  removeFromFavorites: (movieId: string) => void;
  isInFavorites: (movieId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const JWT_SECRET = 'cinemascape-explorer-secret-key';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('cinemascape_token');
    if (token) {
      try {
        const decoded = simpleJWT.verify(token, JWT_SECRET);
        const userData = localStorage.getItem(`user_${decoded.userId}`);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        localStorage.removeItem('cinemascape_token');
      }
    }
  }, []);

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('cinemascape_users') || '[]');
      if (existingUsers.find((u: any) => u.email === email)) {
        return false; // User already exists
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        favorites: []
      };

      // Store user credentials
      const userCredentials = { id: newUser.id, email, password };
      existingUsers.push(userCredentials);
      localStorage.setItem('cinemascape_users', JSON.stringify(existingUsers));

      // Store user data
      localStorage.setItem(`user_${newUser.id}`, JSON.stringify(newUser));

      // Generate JWT token
      const token = simpleJWT.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
      localStorage.setItem('cinemascape_token', token);

      setUser(newUser);
      return true;
    } catch (error) {
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('cinemascape_users') || '[]');
      const userCredentials = existingUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!userCredentials) {
        return false; // Invalid credentials
      }

      // Get user data
      const userData = localStorage.getItem(`user_${userCredentials.id}`);
      if (!userData) {
        return false;
      }

      const user = JSON.parse(userData);
      
      // Generate JWT token
      const token = simpleJWT.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      localStorage.setItem('cinemascape_token', token);

      setUser(user);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('cinemascape_token');
    setUser(null);
  };

  const addToFavorites = (movieId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      favorites: [...user.favorites, movieId]
    };
    
    setUser(updatedUser);
    localStorage.setItem(`user_${user.id}`, JSON.stringify(updatedUser));
  };

  const removeFromFavorites = (movieId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      favorites: user.favorites.filter(id => id !== movieId)
    };
    
    setUser(updatedUser);
    localStorage.setItem(`user_${user.id}`, JSON.stringify(updatedUser));
  };

  const isInFavorites = (movieId: string): boolean => {
    return user ? user.favorites.includes(movieId) : false;
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    addToFavorites,
    removeFromFavorites,
    isInFavorites
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};