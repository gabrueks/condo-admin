import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAdministradora } from '../contexts/administradora-context';
import { getEmpreendimentos } from '../api/empreendimentos';
import {
  getAnnouncement,
  updateAnnouncement,
} from '../api/announcements';

export default function EditAnnouncement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { effectiveAdministradoraId } = useAdministradora();
  const [empreendimentoId, setEmpreendimentoId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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

  const { data: announcement } = useQuery({
    queryKey: ['announcement', id],
    queryFn: () => getAnnouncement(id!),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (announcement) {
      setEmpreendimentoId(announcement.empreendimentoId);
      setTitle(announcement.title);
      setContent(announcement.content);
    }
  }, [announcement]);

  const mutation = useMutation({
    mutationFn: () =>
      updateAnnouncement(id!, {
        title: title.trim(),
        content: content.trim(),
      }),
    onSuccess: () => navigate('/announcements'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  if (!announcement) return null;

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/announcements">Comunicados</Link>
        <span>/</span>
        <span>Editar</span>
      </div>
      <h1>Editar comunicado</h1>
      <form onSubmit={handleSubmit} className="section">
        <div className="field">
          <label>Empreendimento</label>
          <select
            value={empreendimentoId}
            onChange={(e) => setEmpreendimentoId(e.target.value)}
            disabled
          >
            {filteredEmpreendimentos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Titulo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Conteudo</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
            }}
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
