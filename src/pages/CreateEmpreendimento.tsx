import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useAdministradora } from '../contexts/administradora-context';
import { getAdministradoras } from '../api/administradoras';
import { createEmpreendimento } from '../api/empreendimentos';

export default function CreateEmpreendimento() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const { selectedAdministradoraId, effectiveAdministradoraId } =
    useAdministradora();
  const [administradoraId, setAdministradoraId] = useState(
    user?.role === 'SUPER_ADMIN' ? selectedAdministradoraId : ''
  );
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const { data: administradoras } = useQuery({
    queryKey: ['administradoras'],
    queryFn: getAdministradoras,
  });

  const mutation = useMutation({
    mutationFn: createEmpreendimento,
    onSuccess: () => navigate('/empreendimentos'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const admId =
      user?.role === 'SUPER_ADMIN' ? administradoraId : effectiveAdministradoraId;
    if (!admId) return;
    mutation.mutate({
      administradoraId: admId,
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      state: state.trim() || undefined,
    });
  }

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/empreendimentos">Empreendimentos</Link>
        <span>/</span>
        <span>Novo</span>
      </div>
      <h1>Novo empreendimento</h1>
      <form onSubmit={handleSubmit} className="section">
        {user?.role === 'SUPER_ADMIN' && (
          <div className="field">
            <label>Administradora</label>
            <select
              value={administradoraId}
              onChange={(e) => setAdministradoraId(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {administradoras?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        )}
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
            placeholder="ex: ninho-verde-ii"
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
              ?.response?.data?.message ?? 'Erro ao criar'}
          </p>
        )}
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)}>
            Voltar
          </button>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
}
