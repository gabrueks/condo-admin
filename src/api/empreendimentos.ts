import { api } from './client';

export interface Empreendimento {
  id: string;
  administradoraId: string;
  name: string;
  slug: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  administradora?: { id: string; name: string; slug: string };
}

export async function getEmpreendimentos(): Promise<Empreendimento[]> {
  const { data } = await api.get<Empreendimento[]>('/empreendimentos');
  return data;
}

export async function getEmpreendimento(id: string): Promise<Empreendimento> {
  const { data } = await api.get<Empreendimento>(`/empreendimentos/${id}`);
  return data;
}

export async function createEmpreendimento(body: {
  administradoraId: string;
  name: string;
  slug: string;
  address?: string;
  city?: string;
  state?: string;
}): Promise<Empreendimento> {
  const { data } = await api.post<Empreendimento>('/empreendimentos', body);
  return data;
}

export async function updateEmpreendimento(
  id: string,
  body: {
    name?: string;
    slug?: string;
    address?: string;
    city?: string;
    state?: string;
  }
): Promise<Empreendimento> {
  const { data } = await api.patch<Empreendimento>(`/empreendimentos/${id}`, body);
  return data;
}

export async function deleteEmpreendimento(id: string): Promise<void> {
  await api.delete(`/empreendimentos/${id}`);
}
