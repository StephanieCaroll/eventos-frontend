import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./views/util/ProtectedRoute";
import FormCliente from "./views/cliente/FormCliente";
import FormLogin from "./views/login/FormLogin";
import FormDono from "./views/dono/FormDono";
import Home from "./views/home/Home";
import FormEvento from "./views/evento/FormEvento";
import FormAdm from "./views/administrador/FormAdm";
import HomeLogin from "./views/home/HomeLogin";

function Rotas() {
  return (
    <>
      <Routes>

        <Route path="/" element={ <Home />}/>

        <Route path="login" element={<FormLogin />} />

        <Route path="homeLogin" element={<HomeLogin />} />

        <Route path="form-cliente" element={<FormCliente />} />

        <Route path="form-dono" element={<FormDono />} />

        <Route path="form-evento" element={<FormEvento />} />

        {/* <Route path="form-adm" element={<FormAdm />} /> */}
        
      </Routes>
    </>
  );
}

export default Rotas;
