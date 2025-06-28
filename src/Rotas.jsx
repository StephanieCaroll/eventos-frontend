import { Route, Routes, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from './views/util/ProtectedRoute';
import FormCliente from './views/cliente/FormCliente';
import FormLogin from './views/login/FormLogin';
import FormDono from './views/dono/FormDono';
import Home from './views/home/Home';
import FormEvento from './views/evento/FormEvento';
import FormAdm from './views/administrador/FormAdm';
import HomeExpositor from './views/home/HomeExpositor';
import UserProfilePage from './componentes/UserProfilePage';
import EditProfilePage from './views/cliente/EditProfilePage';
import React from 'react';
import HomeGerenciador from './views/home/HomeGerenciador'; 
import ManagerProfilePage from './componentes/ManagerProfilePage';

// Componente placeholder para o Dashboard do Administrador
//talvez eu use
const DashboardAdmin = () => (
  <div style={{ padding: '2em', textAlign: 'center', background: '#f5f7fa', minHeight: '100vh' }}>
    <h1 style={{ color: '#3b82f6' }}>Dashboard do Administrador</h1>
    <p style={{ color: '#444' }}>Bem-vindo(a), Administrador! Esta é a sua área restrita.</p>
  </div>
);

function Rotas() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/profileManager" element={<ManagerProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="login" element={<FormLogin />} />
        <Route path="form-dono" element={<FormDono />} />
        <Route path="form-cliente" element={<FormCliente />} />
        <Route path="form-adm" element={<FormAdm />} />
        <Route
          path="homeExpositor"
          element={
            <ProtectedRoute>
              <HomeExpositor />
            </ProtectedRoute>
          }
        />

        {/* Dashboard do Administrador */}
        <Route
          path="dashboard-admin"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMINISTRADOR']}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/* Cadastro de Evento (Criação), acessível apenas para GERENCIADORES e ADMINISTRADORES */}
        {/* Esta é a única definição para '/form-evento' agora, e é protegida. */}
        <Route
          path="form-evento"
          element={
            <ProtectedRoute allowedRoles={['ROLE_GERENCIADOR', 'ROLE_ADMINISTRADOR']}>
              <FormEvento />
            </ProtectedRoute>
          }
        />

        {/* Edição de Evento, acessível apenas para GERENCIADORES e ADMINISTRADORES */}
        {/* O :id é um parâmetro que será capturado por useParams no FormEvento */}
        <Route
          path="/editar-evento/:id"
          element={
            <ProtectedRoute allowedRoles={['ROLE_GERENCIADOR', 'ROLE_ADMINISTRADOR']}>
              <FormEvento /> 
            </ProtectedRoute>
          }
        />

        {/* Home do Gerenciador */}
        <Route
          path="/homeGerenciador"
          element={
            <ProtectedRoute allowedRoles={['ROLE_GERENCIADOR', 'ROLE_ADMINISTRADOR']}>
              <HomeGerenciador />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default Rotas;
