// src/Rotas.js
// Define as rotas da aplicação, utilizando ProtectedRoute para proteger rotas.
import { Route, Routes } from 'react-router-dom'; // Removido useNavigate pois não é usado diretamente aqui
import { ProtectedRoute } from './views/util/ProtectedRoute'; 
import FormCliente from './views/cliente/FormCliente';
import FormLogin from './views/login/FormLogin'; 
import FormDono from './views/dono/FormDono'; 
import Home from './views/home/Home'; 
import FormEvento from './views/evento/FormEvento'; // Assumindo que este componente existe
import FormAdm from './views/administrador/FormAdm'; // Assumindo que este componente existe
import HomeExpositor from './views/home/HomeExpositor'; // Assumindo que este componente existe
import UserProfilePage from './componentes/UserProfilePage';
import EditProfilePage from './views/cliente/EditProfilePage'; 
import React from 'react'; // Removido useContext pois não é usado diretamente aqui
// Removido AuthContext import pois não é usado diretamente aqui

// Componente placeholder para o Dashboard do Administrador
const DashboardAdmin = () => (
  <div style={{ padding: '2em', textAlign: 'center', background: '#f5f7fa', minHeight: '100vh' }}>
    <h1 style={{ color: '#3b82f6' }}>Dashboard do Administrador</h1>
    <p style={{ color: '#444' }}>Bem-vindo(a), Administrador! Esta é a sua área restrita.</p>
  </div>
);

// Componente placeholder para a Página de Eventos
const EventosPage = () => (
    <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '1.5em' }}>
        <h2>Página de Eventos</h2>
        <p>Aqui você verá a lista de todos os eventos!</p>
        <button onClick={() => window.history.back()} style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '0.8em 2em',
            fontSize: '1em',
            fontWeight: '600',
            border: 'none',
            borderRadius: 30,
            cursor: 'pointer',
            marginTop: '20px'
        }}>Voltar</button>
    </div>
);

function Rotas() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/profile" element={<UserProfilePage />} />
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

        {/* Cadastro de Evento, acessível apenas para GERENCIADORES e ADMINISTRADORES */}
        <Route
          path="form-evento"
          element={
            <ProtectedRoute allowedRoles={['ROLE_GERENCIADOR', 'ROLE_ADMINISTRADOR']}>
              <FormEvento />
            </ProtectedRoute>
          }
        />
        <Route path="/eventos" element={<EventosPage />} />
      </Routes>
    </>
  );
}

export default Rotas;