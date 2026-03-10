import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getSetor } from '../api/setores';
import {
  getQuadras,
  deleteQuadra,
  type Quadra,
} from '../api/quadras';

export default function Quadras() {
  const { setorId } = useParams<{ setorId: string }>();
  const queryClient = useQueryClient();

  const { data: setor } = useQuery({
    queryKey: ['setor', setorId],
    queryFn: () => getSetor(setorId!),
    enabled: Boolean(setorId),
  });
  const { data: quadras } = useQuery({
    queryKey: ['quadras', setorId],
    queryFn: () => getQuadras(setorId!),
    enabled: Boolean(setorId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuadra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quadras', setorId] });
    },
  });

  function handleDelete(q: Quadra) {
    if (window.confirm(`Excluir quadra "${q.code}"?`)) {
      deleteMutation.mutate(q.id);
    }
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
        <span>{setor.name || 'Quadras'}</span>
      </div>
      <h1>Quadras - {setor.name || setorId}</h1>
      <div className="section">
        <div className="form-actions" style={{ marginBottom: '1rem' }}>
          <Link
            to={`/setores/${setorId}/quadras/new`}
            className="btn btn-primary"
          >
            Nova quadra
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Codigo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quadras?.map((q) => (
              <tr key={q.id}>
                <td>{q.code}</td>
                <td>
                  <Link to={`/setores/${setorId}/quadras/${q.id}/edit`}>
                    Editar
                  </Link>
                  {' | '}
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => handleDelete(q)}
                    disabled={deleteMutation.isPending}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
