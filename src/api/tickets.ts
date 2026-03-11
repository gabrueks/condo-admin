import { api } from './client';

export interface Ticket {
  id: string;
  empreendimentoId: string;
  authorId: string;
  category: string;
  title: string;
  description: string | null;
  status: string;
  response: string | null;
  imageUrl: string | null;
  createdAt: string;
  author?: { id: string; name: string; cpf: string };
  empreendimento?: { id: string; name: string };
}

export async function getTickets(params?: {
  empreendimentoId?: string;
  status?: string;
  category?: string;
}): Promise<Ticket[]> {
  const { data } = await api.get<{ items: Ticket[]; total: number } | Ticket[]>('/tickets', { params });
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export async function getTicket(id: string): Promise<Ticket> {
  const { data } = await api.get<Ticket>(`/tickets/${id}`);
  return data;
}

export async function updateTicket(
  id: string,
  body: { status?: string; response?: string }
): Promise<Ticket> {
  const { data } = await api.patch<Ticket>(`/tickets/${id}`, body);
  return data;
}

export async function closeTicket(id: string): Promise<Ticket> {
  return updateTicket(id, { status: 'CLOSED' });
}
