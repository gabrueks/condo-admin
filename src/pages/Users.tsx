import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useAdministradora } from '../contexts/administradora-context';
import { getAdministradoras } from '../api/administradoras';
import { getEmpreendimentos } from '../api/empreendimentos';
import { listUsers } from '../api/users';

export default function Users() {
  const { user } = useAuth();
  const { effectiveAdministradoraId } = useAdministradora();
  const [empreendimentoId, setEmpreendimentoId] = useState('');
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [administradoraId, setAdministradoraId] = useState('');

  const { data: administradoras } = useQuery({
    queryKey: ['administradoras'],
    queryFn: getAdministradoras,
  });
  const { data: empreendimentos } = useQuery({
    queryKey: ['empreendimentos'],
    queryFn: getEmpreendimentos,
  });
  const filteredEmpreendimentos =
    user?.role === 'SUPER_ADMIN' && administradoraId
      ? empreendimentos?.filter((e) => e.administradoraId === administradoraId)
      : empreendimentos ?? [];

  const { data: users } = useQuery({
    queryKey: [
      'users',
      effectiveAdministradoraId ?? administradoraId,
      empreendimentoId,
      role,
      search,
    ],
    queryFn: () =>
      listUsers({
        administradoraId:
          user?.role === 'SUPER_ADMIN' ? administradoraId || undefined : undefined,
        empreendimentoId: empreendimentoId || undefined,
        role: role || undefined,
        search: search.trim() || undefined,
      }),
    enabled: Boolean(user),
  });

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <span>Usuarios</span>
      </div>
      <h1>Usuarios</h1>
      {user?.role === 'SUPER_ADMIN' && (
        <div className="section">
          <label>Administradora</label>
          <select
            value={administradoraId}
            onChange={(e) => {
              setAdministradoraId(e.target.value);
              setEmpreendimentoId('');
            }}
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
      <div className="section">
        <div className="form-inline" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar (nome, CPF, email)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={empreendimentoId}
            onChange={(e) => setEmpreendimentoId(e.target.value)}
          >
            <option value="">Todos empreendimentos</option>
            {(filteredEmpreendimentos ?? []).map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Todos perfis</option>
            <option value="OWNER">Proprietario</option>
            <option value="DEPENDENT">Dependente</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Gerente</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.cpf}</td>
                <td>{u.email ?? '-'}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <Link to={`/users/${u.id}`}>Ver</Link>
                  {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                    <>
                      {' | '}
                      <Link to={`/users/${u.id}/edit`}>Editar</Link>
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
