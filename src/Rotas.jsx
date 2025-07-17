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
import EditManagerPage from './views/dono/EditManagerPage';
import HomeSemLogin from './views/home/HomeSemLogin';
import StandRegistrationModal from './stands/StandRegistrationModal';

function Rotas() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/profileManager" element={<ManagerProfilePage />} />
        <Route path="stand-registration/:eventId" element ={<StandRegistrationModal/>} />
        {/* Rotas para Edição (Retirar Protected PAra testes) */}
        <Route path="/edit-Manager" element={<EditManagerPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />

        <Route path="login" element={<FormLogin />} />
        <Route path="form-dono" element={<FormDono />} />
        <Route path="form-cliente" element={<FormCliente />} />
        <Route path="form-adm" element={<FormAdm />} />
        <Route path="homeSemLogin" element={<HomeSemLogin />} />

        {/* Home do Expositor */}
        <Route
          path="homeExpositor"
          element={
            <ProtectedRoute>
              <HomeExpositor />
            </ProtectedRoute>
          }
        />

        {/* Cadastro de Evento (Criação), acessível apenas para GERENCIADORES e ADMINISTRADORES */}
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
