import { Segment } from 'semantic-ui-react';
import React from 'react';
import './App.css';
import Rotas from './Rotas';

function App() {

  return (

    <div className="App">
      
      <Rotas/>

      <div style={{marginTop: '6%'}}>
        <Segment vertical color='grey' size='tiny' textAlign='center'>
          &copy; 2025 - Projeto e Pratica II - IFPE Jaboatão dos Guararapes
        </Segment>
      </div>

    </div>
  );
}

export default App;
