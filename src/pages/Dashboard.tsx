import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAdministradoras } from '../api/administradoras';
import { getEmpreendimentos } from '../api/empreendimentos';

export default function Dashboard() {
  const { data: administradoras } = useQuery({
    queryKey: ['administradoras'],
    queryFn: getAdministradoras,
  });
  const { data: empreendimentos } = useQuery({
    queryKey: ['empreendimentos'],
    queryFn: getEmpreendimentos,
  });

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="card-grid">
        <div className="card">
          <h2>{administradoras?.length ?? 0}</h2>
          <p>Administradoras</p>
          <Link to="/administradoras">Ver todas</Link>
        </div>
        <div className="card">
          <h2>{empreendimentos?.length ?? 0}</h2>
          <p>Empreendimentos</p>
        </div>
      </div>
      <div className="actions">
        <Link to="/onboard" className="btn btn-primary">
          Nova venda / Onboarding
        </Link>
      </div>
    </div>
  );
}
