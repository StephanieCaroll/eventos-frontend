import React from "react";
import { Link } from "react-router-dom";
import { Menu, MenuMenu, Button, MenuItem } from "semantic-ui-react";

export default function MenuSistema(props) {
  return (
    <>
      <Menu>
        <Menu.Item
          content={<span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '20px', fontWeight: 'bold' }}>EVENTS</span>}
          active={props.tela === "home"}
          as={Link}
          to="/"
        />

        <MenuMenu position="right">
          <Menu>
            <MenuItem 
              content="Login"
              active={props.tela === "Login"}
              as={Link}
              to="/form-cliente">
              <Button primary>Criar</Button>
            </MenuItem>

            <MenuItem>
              <Button>Entrar</Button>
            </MenuItem>

  <MenuItem content="Login"
              active={props.tela === "Dono"}
              as={Link}
              to="/form-dono">
              <Button>Dono</Button>
            </MenuItem>

          </Menu>
        </MenuMenu>
      </Menu>
    </>
  );
}
