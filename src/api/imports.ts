import { api } from './client';

export interface ImportUserResult {
  cpf: string;
  name: string;
  temporaryPassword: string;
  created: boolean;
  error?: string;
}

export interface ImportLoteResult {
  quadraId: string;
  number: number;
  area?: number;
  latitude?: number;
  longitude?: number;
  created: boolean;
  error?: string;
}

export async function importUsers(
  file: File,
  administradoraId?: string
): Promise<ImportUserResult[]> {
  const form = new FormData();
  form.append('file', file);
  if (administradoraId) form.append('administradoraId', administradoraId);
  const { data } = await api.post<ImportUserResult[]>('/users/import', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function importLotes(
  file: File,
  administradoraId?: string
): Promise<ImportLoteResult[]> {
  const form = new FormData();
  form.append('file', file);
  if (administradoraId) form.append('administradoraId', administradoraId);
  const { data } = await api.post<ImportLoteResult[]>('/lotes/import', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
