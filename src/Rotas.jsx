// Define as rotas da aplicação, utilizando ProtectedRoute para proteger rotas.
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './views/util/ProtectedRoute'; 
import FormCliente from './views/cliente/FormCliente'; //  (expositor)
import FormLogin from './views/login/FormLogin'; 
import FormDono from './views/dono/FormDono'; // (gerenciador)
import Home from './views/home/Home'; 
import FormEvento from './views/evento/FormEvento'; 
import FormAdm from './views/administrador/FormAdm'; 
import HomeExpositor from './views/home/HomeExpositor'; 

// Componente placeholder para o Dashboard do Administrador (fazer)

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

        {/* Dashboard do Administrador (AINDA VOU IMPLEMENTAR)*/}
        <Route
          path="dashboard-admin"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMINISTRADOR']}> {/* Apenas Administradores */}
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/* Cadastro de Evento, acessível apenas para GERENCIADORES e ADMINISTRADORES */}
        <Route
          path="form-evento"
          element={
            <ProtectedRoute allowedRoles={['ROLE_GERENCIADOR', 'ROLE_ADMINISTRADOR']}> {/* Gerenciadores e Administradores */}
              <FormEvento />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default Rotas; 
