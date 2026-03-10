import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getEmpreendimento } from '../api/empreendimentos';
import { getSetor, updateSetor } from '../api/setores';

export default function EditSetor() {
  const { empreendimentoId, setorId } = useParams<{
    empreendimentoId: string;
    setorId: string;
  }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [externalId, setExternalId] = useState('');

  const { data: empreendimento } = useQuery({
    queryKey: ['empreendimento', empreendimentoId],
    queryFn: () => getEmpreendimento(empreendimentoId!),
    enabled: Boolean(empreendimentoId),
  });
  const { data: setor } = useQuery({
    queryKey: ['setor', setorId],
    queryFn: () => getSetor(setorId!),
    enabled: Boolean(setorId),
  });

  useEffect(() => {
    if (setor) {
      setName(setor.name ?? '');
      setExternalId(setor.externalId?.toString() ?? '');
    }
  }, [setor]);

  const mutation = useMutation({
    mutationFn: () =>
      updateSetor(setorId!, {
        name: name.trim() || undefined,
        externalId: externalId ? parseInt(externalId, 10) : undefined,
      }),
    onSuccess: () =>
      navigate(`/empreendimentos/${empreendimentoId}/setores`),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  if (!empreendimentoId || !setorId || !empreendimento || !setor) return null;

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
        <span>Editar setor</span>
      </div>
      <h1>Editar setor</h1>
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
              ?.response?.data?.message ?? 'Erro ao atualizar'}
          </p>
        )}
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)}>
            Voltar
          </button>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
