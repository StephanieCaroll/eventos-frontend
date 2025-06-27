// Componente principal da aplicação React, responsável por configurar o provedor de autenticação e as rotas.
import './App.css'; 
import Rotas from './Rotas'; 
import 'semantic-ui-css/semantic.min.css'; 
import { AuthProvider } from './AuthContext'; // Importa o AuthProvider para gerenciar o estado de autenticação
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter para habilitar o roteamento

function App() {
  return (
    <div className="App">
      {/* Envolve a aplicação com BrowserRouter para habilitar o roteamento */}
      <BrowserRouter>
        {/* Envolve a aplicação com AuthProvider para disponibilizar o contexto de autenticação para todos os componentes filhos */}
        <AuthProvider>
          <Rotas /> 
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App; // Exporta o componente App como padrão
