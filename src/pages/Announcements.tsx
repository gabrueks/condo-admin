import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAdministradora } from '../contexts/administradora-context';
import { getEmpreendimentos } from '../api/empreendimentos';
import {
  getAnnouncements,
  deleteAnnouncement,
  type Announcement,
} from '../api/announcements';

export default function Announcements() {
  const { effectiveAdministradoraId } = useAdministradora();
  const queryClient = useQueryClient();
  const [empreendimentoId, setEmpreendimentoId] = useState('');

  const { data: empreendimentos } = useQuery({
    queryKey: ['empreendimentos'],
    queryFn: getEmpreendimentos,
  });
  const filteredEmpreendimentos =
    effectiveAdministradoraId
      ? empreendimentos?.filter(
          (e) => e.administradoraId === effectiveAdministradoraId
        ) ?? []
      : empreendimentos ?? [];

  const { data: result } = useQuery({
    queryKey: ['announcements', empreendimentoId],
    queryFn: () =>
      getAnnouncements({
        empreendimentoId: empreendimentoId || undefined,
        limit: 100,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  function handleDelete(a: Announcement) {
    if (window.confirm(`Excluir "${a.title}"?`)) {
      deleteMutation.mutate(a.id);
    }
  }

  const announcements = result?.items ?? [];

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <span>Comunicados</span>
      </div>
      <h1>Comunicados</h1>
      <div className="section">
        <div className="form-inline" style={{ marginBottom: '1rem' }}>
          <select
            value={empreendimentoId}
            onChange={(e) => setEmpreendimentoId(e.target.value)}
          >
            <option value="">Todos empreendimentos</option>
            {filteredEmpreendimentos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions" style={{ marginBottom: '1rem' }}>
          <Link to="/announcements/new" className="btn btn-primary">
            Novo comunicado
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Empreendimento</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.empreendimento?.name ?? '-'}</td>
                <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/announcements/${a.id}/edit`}>Editar</Link>
                  {' | '}
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => handleDelete(a)}
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
