// Componente de menu de navegação que se adapta ao status de autenticação e aos papéis do usuário.
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, MenuItem } from 'semantic-ui-react';
import { AuthContext } from './AuthContext'; 

export default function MenuSistema(props) {
  const { isAuthenticated, userRoles, logout } = useContext(AuthContext);

  // Função auxiliar para verificar se o usuário possui um determinado papel
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

        {/* Links específicos para administradores - visíveis apenas se o usuário tiver o papel de ADMINISTRADOR */}
        {isAuthenticated && hasRole('ROLE_ADMINISTRADOR') && (
          <MenuItem
            content="Cadastro Adm"
            active={props.tela === 'form-adm'}
            as={Link}
            to="/form-adm"
          />
        )}

        {/* Links específicos para gerenciadores - visíveis apenas se o usuário tiver o papel de GERENCIADOR */}
        {isAuthenticated && hasRole('ROLE_GERENCIADOR') && (
          <MenuItem
            content="Cadastro Evento"
            active={props.tela === 'form-evento'}
            as={Link}
            to="/form-evento"
          />
        )}

        {/* Links específicos para expositores - visíveis apenas se o usuário tiver o papel de EXPOSITOR */}
        {isAuthenticated && hasRole('ROLE_EXPOSITOR') && (
          <MenuItem
            content="Meu Perfil Expositor"
            active={props.tela === 'form-cliente'} // Ajuste conforme a rota real do perfil do expositor
            as={Link}
            to="/form-cliente" // Ou para uma rota de perfil específica do expositor
          />
        )}

        {/* Grupo de botões de Login/Logout, alinhado à direita */}
        <Menu.Menu position="right">
          {!isAuthenticated ? (
            // Se o usuário não estiver autenticado, mostra o botão de Login
            <MenuItem
              content="Login"
              active={props.tela === 'Login'}
              as={Link}
              to="/login"
            >
              <Button primary>Login</Button>
            </MenuItem>
          ) : (
            // Se o usuário estiver autenticado, mostra o botão de Sair
            <MenuItem onClick={logout}>
              <Button secondary>Sair</Button>
            </MenuItem>
          )}
        </Menu.Menu>
      </Menu>
    </>
  );
}
