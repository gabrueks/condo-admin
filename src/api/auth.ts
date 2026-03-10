import { api } from './client';

export interface AuthUser {
  id: string;
  cpf: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  administradoraId: string;
  administradoraName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export async function login(cpf: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { cpf, password });
  return data;
}

export async function me(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/auth/me');
  return data;
}
