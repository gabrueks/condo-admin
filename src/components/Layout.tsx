import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/auth-context';
import { useAdministradora } from '../contexts/administradora-context';
import { getAdministradoras } from '../api/administradoras';

export default function Layout() {
  const { user, logout } = useAuth();
  const { selectedAdministradoraId, setSelectedAdministradoraId } =
    useAdministradora();
  const navigate = useNavigate();

  const { data: administradoras } = useQuery({
    queryKey: ['administradoras'],
    queryFn: getAdministradoras,
  });

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="logo">Momentum Admin</h1>
        {user?.role === 'SUPER_ADMIN' && administradoras && (
          <div className="sidebar-select">
            <label>Administradora</label>
            <select
              value={selectedAdministradoraId}
              onChange={(e) => setSelectedAdministradoraId(e.target.value)}
            >
              <option value="">Selecione</option>
              {administradoras.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <nav>
          <Link to="/">Dashboard</Link>
          {user?.role === 'SUPER_ADMIN' && (
            <Link to="/administradoras">Administradoras</Link>
          )}
          <Link to="/empreendimentos">Empreendimentos</Link>
          <Link to="/users">Usuarios</Link>
          <Link to="/tickets">Tickets</Link>
          <Link to="/announcements">Comunicados</Link>
          <Link to="/access-requests">Solicitacoes de acesso</Link>
          <Link to="/onboard">Nova venda</Link>
          <Link to="/import-users">Importar usuarios</Link>
          <Link to="/import-lotes">Importar lotes</Link>
          <Link to="/create-lote">Novo lote</Link>
        </nav>
        <div className="sidebar-footer">
          <span>{user?.name}</span>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
