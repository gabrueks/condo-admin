import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Administradoras from './pages/Administradoras';
import Empreendimentos from './pages/Empreendimentos';
import CreateEmpreendimento from './pages/CreateEmpreendimento';
import EditEmpreendimento from './pages/EditEmpreendimento';
import Setores from './pages/Setores';
import CreateSetor from './pages/CreateSetor';
import EditSetor from './pages/EditSetor';
import Quadras from './pages/Quadras';
import CreateQuadra from './pages/CreateQuadra';
import EditQuadra from './pages/EditQuadra';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import EditUser from './pages/EditUser';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import Announcements from './pages/Announcements';
import CreateAnnouncement from './pages/CreateAnnouncement';
import EditAnnouncement from './pages/EditAnnouncement';
import AccessRequests from './pages/AccessRequests';
import Onboard from './pages/Onboard';
import ImportUsers from './pages/ImportUsers';
import ImportLotes from './pages/ImportLotes';
import CreateLote from './pages/CreateLote';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="administradoras" element={<Administradoras />} />
        <Route path="empreendimentos" element={<Empreendimentos />} />
        <Route path="empreendimentos/new" element={<CreateEmpreendimento />} />
        <Route path="empreendimentos/:id/edit" element={<EditEmpreendimento />} />
        <Route
          path="empreendimentos/:empreendimentoId/setores"
          element={<Setores />}
        />
        <Route
          path="empreendimentos/:empreendimentoId/setores/new"
          element={<CreateSetor />}
        />
        <Route
          path="empreendimentos/:empreendimentoId/setores/:setorId/edit"
          element={<EditSetor />}
        />
        <Route path="setores/:setorId/quadras" element={<Quadras />} />
        <Route path="setores/:setorId/quadras/new" element={<CreateQuadra />} />
        <Route
          path="setores/:setorId/quadras/:quadraId/edit"
          element={<EditQuadra />}
        />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/:id/edit" element={<EditUser />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="announcements/new" element={<CreateAnnouncement />} />
        <Route path="announcements/:id/edit" element={<EditAnnouncement />} />
        <Route path="access-requests" element={<AccessRequests />} />
        <Route path="onboard" element={<Onboard />} />
        <Route path="import-users" element={<ImportUsers />} />
        <Route path="import-lotes" element={<ImportLotes />} />
        <Route path="create-lote" element={<CreateLote />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
