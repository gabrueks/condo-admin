import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAdministradora } from '../contexts/administradora-context';
import { getEmpreendimentos } from '../api/empreendimentos';
import { getTickets } from '../api/tickets';

export default function Tickets() {
  const { effectiveAdministradoraId } = useAdministradora();
  const [empreendimentoId, setEmpreendimentoId] = useState('');
  const [status, setStatus] = useState('');

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

  const { data: tickets } = useQuery({
    queryKey: ['tickets', empreendimentoId, status],
    queryFn: () =>
      getTickets({
        empreendimentoId: empreendimentoId || undefined,
        status: status || undefined,
      }),
  });

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <span>Tickets</span>
      </div>
      <h1>Tickets</h1>
      <div className="section">
        <div className="form-inline" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
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
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos status</option>
            <option value="OPEN">Aberto</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="RESOLVED">Resolvido</option>
            <option value="CLOSED">Fechado</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Autor</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tickets?.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.category}</td>
                <td>{t.status}</td>
                <td>{t.author?.name ?? '-'}</td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/tickets/${t.id}`}>Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
