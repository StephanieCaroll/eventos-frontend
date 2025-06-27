// Componente principal da aplicação React, responsável por configurar o provedor de autenticação e as rotas.
import './App.css'; 
import Rotas from './Rotas'; 
import 'semantic-ui-css/semantic.min.css'; 
import { AuthProvider } from './AuthContext';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
   
      <BrowserRouter>
     
        <AuthProvider>
          <Rotas /> 
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App; // Exporta o componente App como padrão
