import { api } from './client';

export interface Administradora {
  id: string;
  name: string;
  slug: string;
}

export async function getAdministradoras(): Promise<Administradora[]> {
  const { data } = await api.get<Administradora[]>('/administradoras');
  return data;
}

export async function getAdministradora(id: string): Promise<Administradora> {
  const { data } = await api.get<Administradora>(`/administradoras/${id}`);
  return data;
}

export async function createAdministradora(body: {
  name: string;
  slug: string;
}): Promise<Administradora> {
  const { data } = await api.post<Administradora>('/administradoras', body);
  return data;
}

export async function updateAdministradora(
  id: string,
  body: { name?: string; slug?: string }
): Promise<Administradora> {
  const { data } = await api.patch<Administradora>(
    `/administradoras/${id}`,
    body
  );
  return data;
}

export async function deleteAdministradora(id: string): Promise<void> {
  await api.delete(`/administradoras/${id}`);
}
