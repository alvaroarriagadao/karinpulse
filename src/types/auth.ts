/**
 * Tipos de autenticación para KarinPulse
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  rut: string;
  company: string;
  position: string;
  createdAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  rut: string;
  company: string;
  position: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}


