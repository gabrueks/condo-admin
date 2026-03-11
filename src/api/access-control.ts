import { api } from './client';

export interface AccessRequest {
  id: string;
  empreendimentoId: string;
  requestedBy: string;
  visitorName: string;
  vehiclePlate: string | null;
  date: string;
  approved: boolean | null;
  reviewedAt: string | null;
  createdAt: string;
  requester?: { id: string; name: string; cpf: string };
  empreendimento?: { id: string; name: string };
}

export async function getAccessRequests(params?: {
  empreendimentoId?: string;
}): Promise<AccessRequest[]> {
  const { data } = await api.get<{ items: AccessRequest[]; total: number } | AccessRequest[]>('/access-requests', {
    params,
  });
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export async function approveAccessRequest(id: string): Promise<AccessRequest> {
  const { data } = await api.patch<AccessRequest>(`/access-requests/${id}`, {
    approved: true,
  });
  return data;
}

export async function rejectAccessRequest(id: string): Promise<AccessRequest> {
  const { data } = await api.patch<AccessRequest>(`/access-requests/${id}`, {
    approved: false,
  });
  return data;
}
