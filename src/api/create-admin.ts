import { api } from './client';

export interface CreateAdminBody {
  cpf: string;
  name: string;
  password: string;
  role: string;
  administradoraId: string;
  email?: string;
  phone?: string;
}

export async function createAdmin(body: CreateAdminBody) {
  const { data } = await api.post('/admin/users/create-admin', body);
  return data;
}
