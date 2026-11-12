import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { Token, User } from '@/types';
import { QUERY_KEYS } from '@/lib/react-query/queryKeys';
import { jwtDecode } from 'jwt-decode';

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<Token | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // true while we are reading + validating the stored token on mount
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const rawToken = localStorage.getItem(QUERY_KEYS.TOKEN);
    if (!rawToken) {
      setIsLoading(false);
      return;
    }

    try {
      const parsedToken = JSON.parse(rawToken);
      const localToken = typeof parsedToken === 'string'
        ? { accessToken: parsedToken }
        : parsedToken;

      if (localToken?.accessToken) {
        const decodedToken: User = jwtDecode(localToken.accessToken);

        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem(QUERY_KEYS.TOKEN);
          localStorage.removeItem(QUERY_KEYS.FACULTY);
          setToken(null);
          setUser(null);
          setRole(null);
          setIsSuperAdmin(false);
          setIsAuthenticated(false);
        } else {
          setToken(localToken);
          setUser(decodedToken);
          setRole(decodedToken.role);
          setIsSuperAdmin(decodedToken.role === 'SuperAdmin');
          setIsAuthenticated(true);
        }
      }
    } catch {
      localStorage.removeItem(QUERY_KEYS.TOKEN);
      localStorage.removeItem(QUERY_KEYS.FACULTY);
    } finally {
      // Always mark loading as done so guards can safely run
      setIsLoading(false);
    }
  }, []);

  /**
   * Atomically sets all auth state and persists to localStorage.
   * Use this after a successful login instead of calling individual setters.
   */
  const login = (accessToken: string, userData?: any, refreshToken?: string) => {
    let decoded: any = null;
    try {
      decoded = jwtDecode(accessToken);
    } catch (e) {
      console.warn('jwtDecode error in login:', e);
    }

    const authToken: Token = { accessToken, refreshToken };
    const finalUser = userData || decoded;
    const finalRole = decoded?.role || userData?.role || 'CUSTOMER';

    setToken(authToken);
    setUser(finalUser);
    setRole(finalRole);
    setIsSuperAdmin(finalRole === 'SuperAdmin');
    setIsAuthenticated(true);
    localStorage.setItem(QUERY_KEYS.TOKEN, JSON.stringify(authToken));
    if (finalUser) {
      localStorage.setItem(QUERY_KEYS.FACULTY, JSON.stringify(finalUser));
    }
  };

  /**
   * Clears all auth state and removes from localStorage.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    setIsSuperAdmin(false);
    setIsAuthenticated(false);
    localStorage.removeItem(QUERY_KEYS.TOKEN);
    localStorage.removeItem(QUERY_KEYS.FACULTY);
  };

  const contextValue = {
    user,
    setUser,
    role,
    setRole,
    token,
    setToken,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
