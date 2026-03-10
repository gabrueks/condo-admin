import { api } from './client';

export interface Quadra {
  id: string;
  code: string;
  setorId: string;
}

export async function getQuadras(setorId: string): Promise<Quadra[]> {
  const { data } = await api.get<Quadra[]>('/quadras', {
    params: { setorId },
  });
  return data;
}

export async function getQuadra(id: string): Promise<Quadra> {
  const { data } = await api.get<Quadra>(`/quadras/${id}`);
  return data;
}

export async function createQuadra(body: {
  setorId: string;
  code: string;
}): Promise<Quadra> {
  const { data } = await api.post<Quadra>('/quadras', body);
  return data;
}

export async function updateQuadra(
  id: string,
  body: { code?: string }
): Promise<Quadra> {
  const { data } = await api.patch<Quadra>(`/quadras/${id}`, body);
  return data;
}

export async function deleteQuadra(id: string): Promise<void> {
  await api.delete(`/quadras/${id}`);
}
