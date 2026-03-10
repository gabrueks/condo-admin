import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useAdministradora } from '../contexts/administradora-context';
import { getUser, updateUser, deactivateUser } from '../api/users';

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { effectiveAdministradoraId } = useAdministradora();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  const { data: userData } = useQuery({
    queryKey: ['user', id],
    queryFn: () =>
      getUser(
        id!,
        user?.role === 'SUPER_ADMIN' ? effectiveAdministradoraId : undefined
      ),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setEmail(userData.email ?? '');
      setPhone(userData.phone ?? '');
      setRole(userData.role);
    }
  }, [userData]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateUser(
        id!,
        { name: name.trim(), email: email.trim() || undefined, phone: phone.trim() || undefined, role },
        user?.role === 'SUPER_ADMIN' ? effectiveAdministradoraId : undefined
      ),
    onSuccess: () => navigate(`/users/${id}`),
  });

  const deactivateMutation = useMutation({
    mutationFn: () =>
      deactivateUser(
        id!,
        user?.role === 'SUPER_ADMIN' ? effectiveAdministradoraId : undefined
      ),
    onSuccess: () => navigate('/users'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateMutation.mutate();
  }

  function handleDeactivate() {
    if (window.confirm('Desativar este usuario?')) {
      deactivateMutation.mutate();
    }
  }

  if (!userData) return null;

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/users">Usuarios</Link>
        <span>/</span>
        <Link to={`/users/${id}`}>{userData.name}</Link>
        <span>/</span>
        <span>Editar</span>
      </div>
      <h1>Editar usuario</h1>
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
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Telefone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <div className="field">
            <label>Perfil</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="OWNER">Proprietario</option>
              <option value="DEPENDENT">Dependente</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Gerente</option>
            </select>
          </div>
        )}
        {updateMutation.error && (
          <p className="error">
            {(updateMutation.error as { response?: { data?: { message?: string } } })
              ?.response?.data?.message ?? 'Erro ao atualizar'}
          </p>
        )}
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)}>
            Voltar
          </button>
          <button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
          </button>
          {userData.isActive && (
            <button
              type="button"
              className="btn-outline"
              onClick={handleDeactivate}
              disabled={deactivateMutation.isPending}
            >
              Desativar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
