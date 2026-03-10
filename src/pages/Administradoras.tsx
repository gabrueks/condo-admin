import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  getAdministradoras,
  createAdministradora,
  updateAdministradora,
  deleteAdministradora,
  type Administradora,
} from '../api/administradoras';

export default function Administradoras() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Administradora | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const queryClient = useQueryClient();

  const { data: administradoras } = useQuery({
    queryKey: ['administradoras'],
    queryFn: getAdministradoras,
  });

  const create = useMutation({
    mutationFn: createAdministradora,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administradoras'] });
      setName('');
      setSlug('');
      setError('');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setError(err.response?.data?.message ?? 'Erro ao criar');
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { name: string; slug: string } }) =>
      updateAdministradora(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administradoras'] });
      setEditing(null);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setError(err.response?.data?.message ?? 'Erro ao atualizar');
    },
  });

  const remove = useMutation({
    mutationFn: deleteAdministradora,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administradoras'] });
      setEditing(null);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    create.mutate({ name: name.trim(), slug: slug.trim().toLowerCase() });
  }

  function openEdit(a: Administradora) {
    setEditing(a);
    setEditName(a.name);
    setEditSlug(a.slug);
    setError('');
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError('');
    update.mutate({
      id: editing.id,
      body: {
        name: editName.trim(),
        slug: editSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''),
      },
    });
  }

  function handleDelete(a: Administradora) {
    if (window.confirm(`Excluir "${a.name}"?`)) {
      remove.mutate(a.id);
    }
  }

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <span>Administradoras</span>
      </div>
      <h1>Administradoras</h1>
      <div className="section">
        <h2>Nova administradora</h2>
        <form onSubmit={handleSubmit} className="form-inline">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="slug (ex: momentum)"
            value={slug}
            onChange={(e) => setSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))}
            required
          />
          <button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Criando...' : 'Criar'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="section">
        <h2>Lista</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {administradoras?.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.slug}</td>
                <td>
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => openEdit(a)}
                  >
                    Editar
                  </button>
                  {' | '}
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => handleDelete(a)}
                    disabled={remove.isPending}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="section">
          <h2>Editar administradora</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="field">
              <label>Nome</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Slug</label>
              <input
                type="text"
                value={editSlug}
                onChange={(e) =>
                  setEditSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))
                }
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setEditing(null)}>
                Cancelar
              </button>
              <button type="submit" disabled={update.isPending}>
                {update.isPending ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
