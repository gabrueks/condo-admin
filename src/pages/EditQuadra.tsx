import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getSetor } from '../api/setores';
import { getQuadra, updateQuadra } from '../api/quadras';

export default function EditQuadra() {
  const { setorId, quadraId } = useParams<{
    setorId: string;
    quadraId: string;
  }>();
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const { data: setor } = useQuery({
    queryKey: ['setor', setorId],
    queryFn: () => getSetor(setorId!),
    enabled: Boolean(setorId),
  });
  const { data: quadra } = useQuery({
    queryKey: ['quadra', quadraId],
    queryFn: () => getQuadra(quadraId!),
    enabled: Boolean(quadraId),
  });

  useEffect(() => {
    if (quadra) setCode(quadra.code);
  }, [quadra]);

  const mutation = useMutation({
    mutationFn: () => updateQuadra(quadraId!, { code: code.trim() }),
    onSuccess: () => navigate(`/setores/${setorId}/quadras`),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  if (!setorId || !quadraId || !setor || !quadra) return null;

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
        <span>Editar</span>
      </div>
      <h1>Editar quadra</h1>
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
