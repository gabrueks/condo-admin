import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getEmpreendimentos } from '../api/empreendimentos';
import { getSetores } from '../api/setores';
import { getQuadras } from '../api/quadras';
import { createLote } from '../api/lotes';
export default function CreateLote() {
  const navigate = useNavigate();
  const [empreendimentoId, setEmpreendimentoId] = useState('');
  const [setorId, setSetorId] = useState('');
  const [quadraId, setQuadraId] = useState('');
  const [number, setNumber] = useState('');
  const [area, setArea] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const { data: empreendimentos } = useQuery({
    queryKey: ['empreendimentos'],
    queryFn: getEmpreendimentos,
  });

  const { data: setores } = useQuery({
    queryKey: ['setores', empreendimentoId],
    queryFn: () => getSetores(empreendimentoId),
    enabled: Boolean(empreendimentoId),
  });

  const { data: quadras } = useQuery({
    queryKey: ['quadras', setorId],
    queryFn: () => getQuadras(setorId),
    enabled: Boolean(setorId),
  });

  const mutation = useMutation({
    mutationFn: createLote,
    onSuccess: () => navigate(-1),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(number, 10);
    if (isNaN(num) || num < 1) return;
    mutation.mutate({
      quadraId,
      number: num,
      area: area ? parseFloat(area) : undefined,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
    });
  }

  return (
    <div className="page">
      <h1>Novo lote</h1>

      <form onSubmit={handleSubmit} className="section">
        <div className="field">
          <label>Empreendimento</label>
          <select
            value={empreendimentoId}
            onChange={(e) => {
              setEmpreendimentoId(e.target.value);
              setSetorId('');
              setQuadraId('');
            }}
            required
          >
            <option value="">Selecione</option>
            {empreendimentos?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Setor</label>
          <select
            value={setorId}
            onChange={(e) => {
              setSetorId(e.target.value);
              setQuadraId('');
            }}
            required
            disabled={!empreendimentoId}
          >
            <option value="">Selecione</option>
            {setores?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || s.id}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Quadra</label>
          <select
            value={quadraId}
            onChange={(e) => setQuadraId(e.target.value)}
            required
            disabled={!setorId}
          >
            <option value="">Selecione</option>
            {quadras?.map((q) => (
              <option key={q.id} value={q.id}>
                {q.code}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Numero</label>
          <input
            type="number"
            min={1}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Area (opcional)</label>
          <input
            type="number"
            step="0.01"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Latitude (opcional)</label>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="-23.1234"
          />
        </div>
        <div className="field">
          <label>Longitude (opcional)</label>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="-48.5678"
          />
        </div>
        {mutation.error && (
          <p className="error">
            {(mutation.error as { response?: { data?: { message?: string } } })
              ?.response?.data?.message ?? 'Erro ao criar'}
          </p>
        )}
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)}>
            Voltar
          </button>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
}
