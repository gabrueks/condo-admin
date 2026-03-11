import { api } from './client';

export interface UserListItem {
  id: string;
  cpf: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  isActive: boolean;
  administradoraId: string;
}

export async function listUsers(params?: {
  administradoraId?: string;
  empreendimentoId?: string;
  role?: string;
  search?: string;
}): Promise<UserListItem[]> {
  const { data } = await api.get<{ items: UserListItem[]; total: number } | UserListItem[]>('/users', { params });
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export async function getUser(
  id: string,
  administradoraId?: string
): Promise<UserListItem> {
  const query = administradoraId ? { administradoraId } : {};
  const { data } = await api.get<UserListItem>(`/users/${id}`, { params: query });
  return data;
}

export async function updateUser(
  id: string,
  body: { name?: string; email?: string; phone?: string; role?: string },
  administradoraId?: string
): Promise<UserListItem> {
  const params = administradoraId ? { administradoraId } : {};
  const { data } = await api.patch<UserListItem>(`/users/${id}`, body, {
    params,
  });
  return data;
}

export async function deactivateUser(
  id: string,
  administradoraId?: string
): Promise<void> {
  const params = administradoraId ? { administradoraId } : {};
  await api.delete(`/users/${id}`, { params });
}
