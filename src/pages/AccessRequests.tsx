import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAdministradora } from '../contexts/administradora-context';
import { getEmpreendimentos } from '../api/empreendimentos';
import {
  getAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  type AccessRequest,
} from '../api/access-control';

export default function AccessRequests() {
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

  const { data: requestsData } = useQuery({
    queryKey: ['access-requests', empreendimentoId],
    queryFn: () =>
      getAccessRequests({
        empreendimentoId: empreendimentoId || undefined,
      }),
  });
  const requests = Array.isArray(requestsData) ? requestsData : [];

  const approveMutation = useMutation({
    mutationFn: approveAccessRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-requests'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectAccessRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-requests'] });
    },
  });

  function handleApprove(r: AccessRequest) {
    approveMutation.mutate(r.id);
  }

  function handleReject(r: AccessRequest) {
    rejectMutation.mutate(r.id);
  }

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <span>Solicitacoes de acesso</span>
      </div>
      <h1>Solicitacoes de acesso</h1>
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
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Visitante</th>
              <th>Placa</th>
              <th>Empreendimento</th>
              <th>Solicitante</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.visitorName}</td>
                <td>{r.vehiclePlate ?? '-'}</td>
                <td>{r.empreendimento?.name ?? '-'}</td>
                <td>{r.requester?.name ?? '-'}</td>
                <td>
                  {r.approved === null
                    ? 'Pendente'
                    : r.approved
                      ? 'Aprovado'
                      : 'Rejeitado'}
                </td>
                <td>
                  {r.approved === null && (
                    <>
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => handleApprove(r)}
                        disabled={approveMutation.isPending}
                      >
                        Aprovar
                      </button>
                      {' | '}
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => handleReject(r)}
                        disabled={rejectMutation.isPending}
                      >
                        Rejeitar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
