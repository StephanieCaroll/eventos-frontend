import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { AuthProvider } from './AuthContext';
import { EventProvider } from './contexts/EventContext';
import Rotas from './Rotas';

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