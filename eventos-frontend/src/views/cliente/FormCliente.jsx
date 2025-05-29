import axios from "axios";
import InputMask from "comigo-tech-react-input-mask";
import React, { useState } from "react"; // Removido useEffect pois não está sendo usado
import { Link } from "react-router-dom"; // Removido useLocation pois não está sendo usado
import { Button, Container, Divider, Form, Icon, Message, Segment } from "semantic-ui-react"; // Adicionado Message e Segment
import MenuSistema from "../../MenuSistema";

export default function FormCliente() {
  const [nome, setNome] = useState(""); // Inicializado com string vazia
  const [email, setEmail] = useState(""); // Inicializado com string vazia
  const [dataNascimento, setDataNascimento] = useState(""); // Inicializado com string vazia
  const [foneCelular, setFoneCelular] = useState(""); // Inicializado com string vazia
  const [senha, setSenha] = useState(""); // Inicializado com string vazia
  const [mensagemSucesso, setMensagemSucesso] = useState(false); // Novo estado para mensagem de sucesso
  const [mensagemErro, setMensagemErro] = useState(false); // Novo estado para mensagem de erro

  function salvar() {
    // Limpa mensagens anteriores
    setMensagemSucesso(false);
    setMensagemErro(false);

    let clienteRequest = {
      nome: nome,
      email: email,
      dataNascimento: dataNascimento,
      foneCelular: foneCelular,
      senha: senha,
    };

    axios
      .post("http://localhost:8080/api/cliente", clienteRequest)
      .then((response) => {
        console.log("Cliente cadastrado com sucesso.");
        setMensagemSucesso(true); // Exibe mensagem de sucesso
        setNome("");
        setEmail("");
        setDataNascimento("");
        setFoneCelular("");
        setSenha("");
      })
      .catch((error) => {
        console.log("Erro ao incluir o cliente.", error);
        setMensagemErro(true); // Exibe mensagem de erro
      });
  }

  return (
    <div>
      <MenuSistema tela={"cliente"} />

      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <Segment raised> 
            <h2>
              <span style={{ color: "darkgray" }}>
                Cliente &nbsp;
                <Icon name="angle double right" size="small" />{" "}
              </span>{" "}
              Cadastro{" "}
            </h2>

            <Divider />

            <div style={{ marginTop: "4%" }}>
              <Form>
                <Form.Group widths="equal">
                  <Form.Input
                    required
                    fluid
                    label="Nome Completo" 
                    placeholder="Informe o nome completo do cliente" 
                    maxLength="100"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />

                  <Form.Input
                    required
                    fluid
                    label="Email"
                    placeholder="Informe o email" 
                    type="email" 
                    maxLength="100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group widths="equal"> 
                  <Form.Field>
                    <label>Data de Nascimento</label> 
                    <InputMask
                      mask="99/99/9999"
                      maskChar={null}
                      placeholder="Ex: 20/03/1985"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>Telefone Celular</label> 
                    <InputMask
                      mask="(99) 99999-9999" 
                      value={foneCelular}
                      onChange={(e) => setFoneCelular(e.target.value)}
                    />
                  </Form.Field>

                  <Form.Input
                    required
                    fluid
                    label="Senha"
                    placeholder="Crie uma senha" 
                    type="password"
                    maxLength="100"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </Form.Group>
              </Form>

              {mensagemSucesso && ( // Exibe mensagem de sucesso se o estado for true
                <Message success header="Cadastro Realizado!" content="Cliente cadastrado com sucesso." />
              )}

              {mensagemErro && ( // Exibe mensagem de erro se o estado for true
                <Message error header="Erro no Cadastro" content="Ocorreu um erro ao tentar cadastrar o cliente. Tente novamente." />
              )}

              <div style={{ marginTop: "4%" }}>
                <Link to={"/"}>
                  <Button
                    type="button"
                    inverted
                    circular
                    icon
                    labelPosition="left"
                    color="orange"
                  >
                    <Icon name="reply" />
                    Voltar
                  </Button>
                </Link>
                <Button
                  inverted
                  circular
                  icon
                  labelPosition="left"
                  color="blue"
                  floated="right"
                  onClick={() => salvar()}
                >
                  <Icon name="save" />
                  Salvar
                </Button>
              </div>
            </div>
          </Segment>
        </Container>
      </div>
    </div>
  );
}