import { api } from './client';

export interface OnboardResult {
  administradoraId: string;
  empreendimentoId: string;
  adminUserId: string;
  setoresCreated: number;
  quadrasCreated: number;
  lotesCreated: number;
}

export interface OnboardBody {
  administradora: { name: string; slug: string };
  empreendimento: {
    name: string;
    slug: string;
    address?: string;
    city?: string;
    state?: string;
  };
  adminUser: {
    cpf: string;
    name: string;
    password: string;
    email?: string;
    phone?: string;
    role?: string;
  };
  structure?: {
    setores: {
      name?: string;
      quadras: {
        code: string;
        lotes: { number: number; area?: number }[];
      }[];
    }[];
  };
}

export async function onboard(body: OnboardBody): Promise<OnboardResult> {
  const { data } = await api.post<OnboardResult>('/admin/onboard', body);
  return data;
}
