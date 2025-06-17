import { Route, Routes } from "react-router-dom";
import FormCliente from "./views/cliente/FormCliente";
import LoginCliente from "./views/cliente/LoginCliente";
import FormDono from './views/dono/FormDono';
import LoginDono from "./views/dono/LoginDono";
import Home from './views/home/Home';
import FormEvento from "./views/evento/FormEvento";

function Rotas() {
    return (
        <>
            <Routes>
                <Route path="/" element={ <Home/> } />
                <Route path="cliente-login" element={ <LoginCliente/> } />
                <Route path="cliente/*" element={ <FormCliente/> } />
                <Route path="form-dono" element={ <FormDono/> } />
                <Route path="dono-login" element={ <LoginDono/> } />
                <Route path="form-evento" element={ <FormEvento/> } />
            </Routes>
        </>
    )
}

export default Rotas
