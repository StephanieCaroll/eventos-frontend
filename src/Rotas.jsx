import { Route, Routes } from 'react-router-dom';
import ManagerProfilePage from './componentes/ManagerProfilePage';
import UserProfilePage from './componentes/UserProfilePage';
import StandRegistrationModal from './stands/StandRegistrationModal';
import FormAdm from './views/administrador/FormAdm';
import EditProfilePage from './views/cliente/EditProfilePage';
import FormCliente from './views/cliente/FormCliente';
import EditManagerPage from './views/dono/EditManagerPage';
import FormDono from './views/dono/FormDono';
import FormEvento from './views/evento/FormEvento';
import Home from './views/home/Home';
import HomeExpositor from './views/home/HomeExpositor';
import HomeGerenciador from './views/home/HomeGerenciador';
import HomeSemLogin from './views/home/HomeSemLogin';
import FormLogin from './views/login/FormLogin';
import { ProtectedRoute } from './views/util/ProtectedRoute';

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

        {/* Seleção de Stands do Expositor */}
        <Route
          path="/stand-selection/:eventId"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
              <StandRegistrationModal />
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

// O componente correto é StandRegistrationModal para seleção de stands do expositor
