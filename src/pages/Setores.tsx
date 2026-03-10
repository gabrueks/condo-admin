import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getEmpreendimento } from '../api/empreendimentos';
import {
  getSetores,
  deleteSetor,
  type Setor,
} from '../api/setores';

export default function Setores() {
  const { empreendimentoId } = useParams<{ empreendimentoId: string }>();
  const queryClient = useQueryClient();

  const { data: empreendimento } = useQuery({
    queryKey: ['empreendimento', empreendimentoId],
    queryFn: () => getEmpreendimento(empreendimentoId!),
    enabled: Boolean(empreendimentoId),
  });
  const { data: setores } = useQuery({
    queryKey: ['setores', empreendimentoId],
    queryFn: () => getSetores(empreendimentoId!),
    enabled: Boolean(empreendimentoId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSetor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setores', empreendimentoId] });
    },
  });

  function handleDelete(s: Setor) {
    if (window.confirm(`Excluir setor "${s.name || s.id}"?`)) {
      deleteMutation.mutate(s.id);
    }
  }

  if (!empreendimentoId || !empreendimento) return null;

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/empreendimentos">Empreendimentos</Link>
        <span>/</span>
        <span>{empreendimento.name}</span>
        <span>/</span>
        <span>Setores</span>
      </div>
      <h1>Setores - {empreendimento.name}</h1>
      <div className="section">
        <div className="form-actions" style={{ marginBottom: '1rem' }}>
          <Link
            to={`/empreendimentos/${empreendimentoId}/setores/new`}
            className="btn btn-primary"
          >
            Novo setor
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>External ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {setores?.map((s) => (
              <tr key={s.id}>
                <td>{s.name ?? '-'}</td>
                <td>{s.externalId ?? '-'}</td>
                <td>
                  <Link to={`/setores/${s.id}/quadras`}>Quadras</Link>
                  {' | '}
                  <Link to={`/empreendimentos/${empreendimentoId}/setores/${s.id}/edit`}>
                    Editar
                  </Link>
                  {' | '}
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => handleDelete(s)}
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
