import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getSetor } from '../api/setores';
import { createQuadra } from '../api/quadras';

export default function CreateQuadra() {
  const { setorId } = useParams<{ setorId: string }>();
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const { data: setor } = useQuery({
    queryKey: ['setor', setorId],
    queryFn: () => getSetor(setorId!),
    enabled: Boolean(setorId),
  });

  const mutation = useMutation({
    mutationFn: createQuadra,
    onSuccess: () => navigate(`/setores/${setorId}/quadras`),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ setorId: setorId!, code: code.trim() });
  }

  if (!setorId || !setor) return null;

  const empreendimentoId = setor.empreendimentoId;

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/empreendimentos">Empreendimentos</Link>
        <span>/</span>
        <Link to={`/empreendimentos/${empreendimentoId}/setores`}>
          {setor.empreendimento?.name ?? 'Setores'}
        </Link>
        <span>/</span>
        <Link to={`/setores/${setorId}/quadras`}>
          {setor.name || 'Quadras'}
        </Link>
        <span>/</span>
        <span>Nova quadra</span>
      </div>
      <h1>Nova quadra</h1>
      <form onSubmit={handleSubmit} className="section">
        <div className="field">
          <label>Codigo</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
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
