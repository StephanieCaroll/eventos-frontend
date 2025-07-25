import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Menu, MenuItem } from 'semantic-ui-react';
import { AuthContext } from './AuthContext';

export default function MenuSistema(props) {
    const { isAuthenticated, userRoles } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        console.log('--- MenuSistema State ---');
        console.log('isAuthenticated (MenuSistema):', isAuthenticated);
        console.log('location.pathname (MenuSistema):', location.pathname);
        console.log('isHomePage (MenuSistema):', location.pathname === '/');
        console.log('-------------------------');
    }, [isAuthenticated, location.pathname]);

    const hasRole = (role) => userRoles.includes(role);

    const isHomePage = location.pathname === '/';
    const isFormEventoPage = location.pathname === '/form-evento';
    const isLoginPage = location.pathname === '/login';

    return (
        <>
            <Menu style={{
                background: 'linear-gradient(135deg, #000000 0%, #0a192f 100%)',
                color: '#fff',
                margin: 0,
                padding: "1.5em 2em",
                display: "flex",
                flexWrap: "wrap",
                gap: "1em",
                textAlign: 'center',
                borderBottom: '1px solid #1e293b'
            }}>

                <Menu.Item
                    content={
                        <img
                            src="/LogoPrincipal.png"
                            alt="LogoPrincipal"
                            style={{
                                height: '40px',
                                width: '100px',
                                objectFit: 'contain',
                                verticalAlign: 'middle'
                            }}
                        />
                    }
                    active={isHomePage}
                    as={Link}
                    to={isAuthenticated ? '/' : '/'}
                />

                {isAuthenticated && hasRole('ROLE_ADMINISTRADOR') && (
                    <MenuItem
                        // content="Cadastro Adm" 
                        active={location.pathname === '/form-adm'}
                        as={Link}
                        to="/form-adm"
                    />
                )}

                {isAuthenticated && hasRole('ROLE_GERENCIADOR') && !isHomePage && !isFormEventoPage && (
                    <MenuItem
                        // content="Cadastro Evento" 
                        active={isFormEventoPage}
                        as={Link}
                        to="/form-evento"
                    />
                )}

                {isAuthenticated && hasRole('ROLE_EXPOSITOR') && (
                    <MenuItem
                        // content="Meu Perfil Expositor" 
                        active={location.pathname === '/form-cliente'}
                        as={Link}
                        to="/form-cliente"
                    />
                )}

                <Menu.Menu position="right">

                    {!isAuthenticated && (
                        <MenuItem
                            active={isLoginPage}
                            as={Link}
                            to="/login"
                        >
                            <Button primary>Login</Button>
                        </MenuItem>
                    )}
                </Menu.Menu>
            </Menu>
        </>
    );
}