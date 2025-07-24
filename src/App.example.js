// Arquivo principal da aplicação - App.js
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { EventProvider } from './contexts/EventContext';

// Importar componentes principais
import StandRegistrationModal from './stands/StandRegistrationModal';
import FormEvento from './views/evento/FormEvento';
import Home from './views/home/Home';
import HomeExpositor from './views/home/HomeExpositor';

// Importar estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/StandGrid.css';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/homeExpositor" element={<HomeExpositor />} />
              <Route path="/formEvento" element={<FormEvento />} />
              <Route path="/formEvento/:id" element={<FormEvento />} />
              <Route path="/stand-registration/:eventId" element={<StandRegistrationModal />} />
              {/* Adicionar outras rotas conforme necessário */}
            </Routes>
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;