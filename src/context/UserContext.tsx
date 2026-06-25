'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const STORAGE_KEY = 'fintech_user_id';

interface UserContextValue {
  userId: string;
  ready: boolean;
  login: (id: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue>({
  userId: '',
  ready: false,
  login: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState('');
  const [ready, setReady] = useState(false);

  // Runs once on the client after hydration — safe localStorage access.
  useEffect(() => {
    setUserId(localStorage.getItem(STORAGE_KEY) ?? '');
    setReady(true);
  }, []);

  const login = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setUserId(id);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUserId('');
  }, []);

  return (
    <UserContext.Provider value={{ userId, ready, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
