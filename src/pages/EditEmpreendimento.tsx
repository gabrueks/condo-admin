import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  getEmpreendimento,
  updateEmpreendimento,
} from '../api/empreendimentos';

export default function EditEmpreendimento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const { data: empreendimento } = useQuery({
    queryKey: ['empreendimento', id],
    queryFn: () => getEmpreendimento(id!),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (empreendimento) {
      setName(empreendimento.name);
      setSlug(empreendimento.slug);
      setAddress(empreendimento.address ?? '');
      setCity(empreendimento.city ?? '');
      setState(empreendimento.state ?? '');
    }
  }, [empreendimento]);

  const mutation = useMutation({
    mutationFn: () =>
      updateEmpreendimento(id!, {
        name: name.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
      }),
    onSuccess: () => navigate('/empreendimentos'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  if (!empreendimento) return null;

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/empreendimentos">Empreendimentos</Link>
        <span>/</span>
        <span>Editar</span>
      </div>
      <h1>Editar empreendimento</h1>
      <form onSubmit={handleSubmit} className="section">
        <div className="field">
          <label>Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))
            }
            required
          />
        </div>
        <div className="field">
          <label>Endereco (opcional)</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Cidade (opcional)</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Estado (opcional)</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
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
