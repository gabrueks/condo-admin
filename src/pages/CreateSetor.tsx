import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getEmpreendimento } from '../api/empreendimentos';
import { createSetor } from '../api/setores';

export default function CreateSetor() {
  const { empreendimentoId } = useParams<{ empreendimentoId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [externalId, setExternalId] = useState('');

  const { data: empreendimento } = useQuery({
    queryKey: ['empreendimento', empreendimentoId],
    queryFn: () => getEmpreendimento(empreendimentoId!),
    enabled: Boolean(empreendimentoId),
  });

  const mutation = useMutation({
    mutationFn: createSetor,
    onSuccess: () =>
      navigate(`/empreendimentos/${empreendimentoId}/setores`),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      empreendimentoId: empreendimentoId!,
      name: name.trim() || undefined,
      externalId: externalId ? parseInt(externalId, 10) : undefined,
    });
  }

  if (!empreendimentoId || !empreendimento) return null;

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/empreendimentos">Empreendimentos</Link>
        <span>/</span>
        <Link to={`/empreendimentos/${empreendimentoId}/setores`}>
          {empreendimento.name}
        </Link>
        <span>/</span>
        <span>Novo setor</span>
      </div>
      <h1>Novo setor</h1>
      <form onSubmit={handleSubmit} className="section">
        <div className="field">
          <label>Nome (opcional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label>External ID (opcional)</label>
          <input
            type="number"
            value={externalId}
            onChange={(e) => setExternalId(e.target.value)}
          />
        </div>
        {mutation.error && (
          <p className="error">
            {(mutation.error as { response?: { data?: { message?: string } } })
              ?.response?.data?.message ?? 'Erro ao criar'}
          </p>
        )}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
          >
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
