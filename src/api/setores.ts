import { api } from './client';

export interface Setor {
  id: string;
  name: string | null;
  empreendimentoId: string;
  externalId: number | null;
  empreendimento?: { id: string; name: string };
}

export async function getSetores(empreendimentoId: string): Promise<Setor[]> {
  const { data } = await api.get<Setor[]>('/setores', {
    params: { empreendimentoId },
  });
  return data;
}

export async function getSetor(id: string): Promise<Setor> {
  const { data } = await api.get<Setor>(`/setores/${id}`);
  return data;
}

export async function createSetor(body: {
  empreendimentoId: string;
  name?: string;
  externalId?: number;
}): Promise<Setor> {
  const { data } = await api.post<Setor>('/setores', body);
  return data;
}

export async function updateSetor(
  id: string,
  body: { name?: string; externalId?: number }
): Promise<Setor> {
  const { data } = await api.patch<Setor>(`/setores/${id}`, body);
  return data;
}

export async function deleteSetor(id: string): Promise<void> {
  await api.delete(`/setores/${id}`);
}
