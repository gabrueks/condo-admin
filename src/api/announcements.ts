import { api } from './client';

export interface Announcement {
  id: string;
  empreendimentoId: string;
  authorId: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  empreendimento?: { id: string; name: string };
}

export interface AnnouncementsResponse {
  items: Announcement[];
  total: number;
}

export async function getAnnouncements(params?: {
  empreendimentoId?: string;
  limit?: number;
  offset?: number;
}): Promise<AnnouncementsResponse> {
  const { data } = await api.get<AnnouncementsResponse>('/announcements', {
    params,
  });
  return data;
}

export async function getAnnouncement(id: string): Promise<Announcement> {
  const { data } = await api.get<Announcement>(`/announcements/${id}`);
  return data;
}

export async function createAnnouncement(body: {
  empreendimentoId: string;
  title: string;
  content: string;
  imageUrl?: string;
}): Promise<Announcement> {
  const { data } = await api.post<Announcement>('/announcements', body);
  return data;
}

export async function updateAnnouncement(
  id: string,
  body: { title?: string; content?: string; imageUrl?: string }
): Promise<Announcement> {
  const { data } = await api.patch<Announcement>(`/announcements/${id}`, body);
  return data;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await api.delete(`/announcements/${id}`);
}
