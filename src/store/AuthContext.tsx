/**
 * Contexto de autenticación para KarinPulse
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, User } from '@/types';
import { getCurrentUser, loginUser, logoutUser, registerUser, LoginData, RegisterData } from '@/services';

interface AuthContextType extends AuthState {
  register: (data: RegisterData) => Promise<{ error: Error | null }>;
  login: (data: LoginData) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar usuario al cargar
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setIsLoading(true);
      console.log('AuthContext: Verificando sesión actual...');
      const { user: currentUser, error } = await getCurrentUser();
      
      if (error) {
        console.error('AuthContext: Error al verificar usuario:', error);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      if (currentUser) {
        console.log('AuthContext: Usuario encontrado y autenticado:', currentUser.email);
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        console.log('AuthContext: No hay sesión activa');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('AuthContext: Error inesperado al verificar usuario:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<{ error: Error | null }> => {
    try {
      setIsLoading(true);
      const { user: newUser, error } = await registerUser(data);

      if (error) {
        console.error('AuthContext: Error en registro:', error);
        return { error };
      }

      if (newUser) {
        console.log('AuthContext: Registro exitoso, usuario:', newUser.email);
        setUser(newUser);
        setIsAuthenticated(true);
      }

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Error desconocido al registrar'),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<{ error: Error | null }> => {
    try {
      setIsLoading(true);
      console.log('AuthContext: Intentando login...');
      const { user: loggedUser, error } = await loginUser(data);

      if (error) {
        console.error('AuthContext: Error en login:', error);
        return { error };
      }

      if (loggedUser) {
        console.log('AuthContext: Login exitoso, usuario:', loggedUser.email);
        setUser(loggedUser);
        setIsAuthenticated(true);
      }

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Error desconocido al iniciar sesión'),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    await checkUser();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

