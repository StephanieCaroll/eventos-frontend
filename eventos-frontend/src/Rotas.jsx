import React from 'react';
import { Route, Routes } from "react-router-dom";
import FormDono from './views/dono/FormDono';
import FormCliente from './views/cliente/FormCliente';
import Home from './views/home/Home';

function Rotas() {
    return (
        <>
            <Routes>
                <Route path="/" element={ <Home/> } />
                <Route path="form-cliente" element={ <FormCliente/> } />
                <Route path="form-dono" element={ <FormDono/> } />
            </Routes>
        </>
    )
}

export default Rotas
