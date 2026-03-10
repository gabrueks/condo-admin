import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useAdministradora } from '../contexts/administradora-context';
import { getAdministradoras } from '../api/administradoras';
import {
  getEmpreendimentos,
  deleteEmpreendimento,
  type Empreendimento,
} from '../api/empreendimentos';

export default function Empreendimentos() {
  const { user } = useAuth();
  const { selectedAdministradoraId, setSelectedAdministradoraId } =
    useAdministradora();
  const queryClient = useQueryClient();

  const { data: administradoras } = useQuery({
    queryKey: ['administradoras'],
    queryFn: getAdministradoras,
  });
  const { data: empreendimentos } = useQuery({
    queryKey: ['empreendimentos'],
    queryFn: getEmpreendimentos,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmpreendimento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empreendimentos'] });
    },
  });

  const filtered =
    (user?.role === 'SUPER_ADMIN' && selectedAdministradoraId
      ? empreendimentos?.filter((e) => e.administradoraId === selectedAdministradoraId)
      : empreendimentos) ?? [];

  function handleDelete(e: Empreendimento) {
    if (window.confirm(`Excluir "${e.name}"?`)) {
      deleteMutation.mutate(e.id);
    }
  }

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <span>Empreendimentos</span>
      </div>
      <h1>Empreendimentos</h1>
      {user?.role === 'SUPER_ADMIN' && (
        <div className="section">
          <label>Administradora</label>
          <select
            value={selectedAdministradoraId}
            onChange={(e) => setSelectedAdministradoraId(e.target.value)}
          >
            <option value="">Todas</option>
            {administradoras?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="section">
        <div className="form-actions" style={{ marginBottom: '1rem' }}>
          <Link to="/empreendimentos/new" className="btn btn-primary">
            Novo empreendimento
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              {user?.role === 'SUPER_ADMIN' && <th>Administradora</th>}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{e.slug}</td>
                {user?.role === 'SUPER_ADMIN' && (
                  <td>{e.administradora?.name ?? '-'}</td>
                )}
                <td>
                  <Link to={`/empreendimentos/${e.id}/edit`}>Editar</Link>
                  {' | '}
                  <Link to={`/empreendimentos/${e.id}/setores`}>Setores</Link>
                  {' | '}
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => handleDelete(e)}
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
