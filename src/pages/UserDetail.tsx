import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useAdministradora } from '../contexts/administradora-context';
import { getUser } from '../api/users';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { effectiveAdministradoraId } = useAdministradora();

  const { data: userData } = useQuery({
    queryKey: ['user', id],
    queryFn: () =>
      getUser(
        id!,
        user?.role === 'SUPER_ADMIN' ? effectiveAdministradoraId : undefined
      ),
    enabled: Boolean(id),
  });

  if (!userData) return null;

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <Link to="/users">Usuarios</Link>
        <span>/</span>
        <span>{userData.name}</span>
      </div>
      <h1>{userData.name}</h1>
      <div className="section">
        <table>
          <tbody>
            <tr>
              <th>CPF</th>
              <td>{userData.cpf}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{userData.email ?? '-'}</td>
            </tr>
            <tr>
              <th>Telefone</th>
              <td>{userData.phone ?? '-'}</td>
            </tr>
            <tr>
              <th>Perfil</th>
              <td>{userData.role}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{userData.isActive ? 'Ativo' : 'Inativo'}</td>
            </tr>
          </tbody>
        </table>
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <Link to={`/users/${id}/edit`} className="btn btn-primary">
              Editar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
