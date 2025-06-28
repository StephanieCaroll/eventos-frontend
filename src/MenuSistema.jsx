import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, MenuItem } from 'semantic-ui-react';
import { AuthContext } from './AuthContext';

export default function MenuSistema(props) {
    const { isAuthenticated, userRoles, logout } = useContext(AuthContext);

    const hasRole = (role) => userRoles.includes(role);

    return (
        <>
            <Menu style={{ backgroundColor: '#0a192f', color: '#fff', border: 0, borderRadius: 0, margin: 0, padding: '20px 1em 20px' }}>

                <Menu.Item
                    content={<span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '30px', fontWeight: 'bold', color: '#3b82f6' }}>EVENTS</span>}
                    active={props.tela === 'home' || props.tela === 'Home'}
                    as={Link}
                    to={isAuthenticated ? '/' : '/'}
                />

                {isAuthenticated && hasRole('ROLE_ADMINISTRADOR') && (
                    <MenuItem
                        content="Cadastro Adm"
                        active={props.tela === 'form-adm'}
                        as={Link}
                        to="/form-adm"
                    />
                )}

                {isAuthenticated && hasRole('ROLE_GERENCIADOR') && (
                    <MenuItem
                        content="Cadastro Evento"
                        active={props.tela === 'form-evento'}
                        as={Link}
                        to="/form-evento"
                    />
                )}

                {isAuthenticated && hasRole('ROLE_EXPOSITOR') && (
                    <MenuItem
                        content="Meu Perfil Expositor"
                        active={props.tela === 'form-cliente'}
                        as={Link}
                        to="/form-cliente"
                    />
                )}

                <Menu.Menu position="right">
                    <MenuItem
                        content="Login"
                        active={props.tela === 'Login'}
                        as={Link}
                        to="/login"
                    >
                        <Button primary>Login</Button>
                    </MenuItem>
                </Menu.Menu>
            </Menu>
        </>
    );
}