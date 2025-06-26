import { Link } from "react-router-dom";
import { Button, Menu, MenuItem } from "semantic-ui-react";
import { logout } from './views/util/AuthenticationService';

export default function MenuSistema(props) {
  return (
    <>
      <Menu style={{ backgroundColor: '#0a192f', color: '#fff', border: 0, borderRadius: 0, margin: 0, padding: '20px 1em 20px' }}>
        <Menu.Item
          content={<span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '30px', fontWeight: 'bold', color: '#3b82f6' }}>EVENTS</span>}
          active={props.tela === "home"}
          as={Link}
          to="/"
        />

        <MenuItem display="flex" position="right"
          content="Login"
          active={props.tela === "Login"}
          as={Link}
          to="/login">
          <Button primary >Login</Button>
        </MenuItem>

      </Menu>
    </>
  );
}
