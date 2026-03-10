import { api } from './client';

export interface CreateLoteBody {
  quadraId: string;
  number: number;
  area?: number;
  latitude?: number;
  longitude?: number;
}

export async function createLote(body: CreateLoteBody) {
  const { data } = await api.post('/lotes', body);
  return data;
}
