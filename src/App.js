import './App.css';
import Rotas from './Rotas';
import 'semantic-ui-css/semantic.min.css';
import { AuthProvider } from './AuthContext';
import { EventProvider } from './contexts/EventContext'; 
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <EventProvider> 
            <Rotas />
          </EventProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;