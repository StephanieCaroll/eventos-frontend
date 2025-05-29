import { Route, Routes } from "react-router-dom";
import FormCliente from "./views/cliente/FormCliente";
import LoginCliente from "./views/cliente/LoginCliente";
import FormDono from './views/dono/FormDono';
import Home from './views/home/Home';

function Rotas() {
    return (
        <>
            <Routes>
                <Route path="/" element={ <Home/> } />
                <Route path="cliente-login" element={ <LoginCliente/> } />
                <Route path="cliente/*" element={ <FormCliente/> } />
                <Route path="form-dono" element={ <FormDono/> } />
            </Routes>
        </>
    )
}

export default Rotas
