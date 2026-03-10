import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getTicket, updateTicket } from '../api/tickets';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [response, setResponse] = useState('');

  const { data: ticket } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicket(id!),
    enabled: Boolean(id),
  });

  const respondMutation = useMutation({
    mutationFn: () =>
      updateTicket(id!, {
        response: response.trim(),
        status: 'IN_PROGRESS',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      setResponse('');
    },
  });

  const closeMutation = useMutation({
    mutationFn: () => updateTicket(id!, { status: 'CLOSED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
    },
  });

  function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    if (response.trim()) respondMutation.mutate();
  }

  if (!ticket) return null;

  const canRespond = ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED';

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/tickets">Tickets</Link>
        <span>/</span>
        <span>{ticket.title}</span>
      </div>
      <h1>{ticket.title}</h1>
      <div className="section">
        <table>
          <tbody>
            <tr>
              <th>Categoria</th>
              <td>{ticket.category}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{ticket.status}</td>
            </tr>
            <tr>
              <th>Autor</th>
              <td>{ticket.author?.name ?? '-'} ({ticket.author?.cpf ?? '-'})</td>
            </tr>
            <tr>
              <th>Data</th>
              <td>{new Date(ticket.createdAt).toLocaleString()}</td>
            </tr>
            <tr>
              <th>Descricao</th>
              <td>{ticket.description ?? '-'}</td>
            </tr>
            {ticket.response && (
              <tr>
                <th>Resposta</th>
                <td>{ticket.response}</td>
              </tr>
            )}
          </tbody>
        </table>
        {canRespond && (
          <>
            <h2 style={{ marginTop: '1.5rem' }}>Responder</h2>
            <form onSubmit={handleRespond}>
              <div className="field">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                  }}
                />
              </div>
              <div className="form-actions">
                <button type="submit" disabled={!response.trim() || respondMutation.isPending}>
                  {respondMutation.isPending ? 'Enviando...' : 'Enviar resposta'}
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => closeMutation.mutate()}
                  disabled={closeMutation.isPending}
                >
                  Fechar ticket
                </button>
              </div>
            </form>
          </>
        )}
        {!canRespond && (
          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <Link to="/tickets">Voltar</Link>
          </div>
        )}
      </div>
    </div>
  );
}
