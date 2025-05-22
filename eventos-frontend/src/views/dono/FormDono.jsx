import axios from "axios";
import InputMask from "comigo-tech-react-input-mask";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Divider,
  Form,
  Grid, 
  Icon,
  Message,
  Segment,
} from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";

export default function FormDono() {
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [dataNascimento, setDataNascimento] = useState(""); 

  const [enderecoRua, setEnderecoRua] = useState("");
  const [enderecoComplemento, setEnderecoComplemento] = useState("");
  const [enderecoNumero, setEnderecoNumero] = useState("");
  const [enderecoBairro, setEnderecoBairro] = useState("");
  const [enderecoCidade, setEnderecoCidade] = useState("");
  const [enderecoCep, setEnderecoCep] = useState("");
  const [enderecoUf, setEnderecoUf] = useState("");

  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(false);

  function salvar() {
    setMensagemSucesso(false);
    setMensagemErro(false);

    let donoRequest = {
      razaoSocial: razaoSocial,
      nome: nome,
      email: email,
      cpf: cpf,
      rg: rg,
      dataNascimento: dataNascimento,
      enderecoRua: enderecoRua,
      enderecoComplemento: enderecoComplemento,
      enderecoNumero: enderecoNumero,
      enderecoBairro: enderecoBairro,
      enderecoCidade: enderecoCidade,
      enderecoCep: enderecoCep,
      enderecoUf: enderecoUf,
    };

    axios
      .post("http://localhost:8080/api/dono", donoRequest)
      .then((response) => {
        console.log("Dono cadastrado com sucesso.");
        setRazaoSocial("");
        setNome("");
        setEmail("");
        setCpf("");
        setRg("");
        setDataNascimento("");
        setEnderecoRua("");
        setEnderecoComplemento("");
        setEnderecoNumero("");
        setEnderecoBairro("");
        setEnderecoCidade("");
        setEnderecoCep("");
        setEnderecoUf("");
        setMensagemSucesso(true);
      })
      .catch((error) => {
        console.log("Erro ao incluir o Dono.", error);
        setMensagemErro(true);
      });
  }

  return (
    <div>
      <MenuSistema tela={"dono"} />

      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <Segment raised>
            <h2>
              <span style={{ color: "darkgray" }}>
                Dono &nbsp;
                <Icon name="angle double right" size="small" />{" "}
              </span>{" "}
              Cadastro{" "}
            </h2>

            <Divider />

            <div style={{ marginTop: "4%" }}>
              <Form>

                <h3>Dados Pessoais</h3>
                <Grid columns={2} stackable>
                  <Grid.Column>
                    <Form.Input
                      required
                      fluid
                      label="Nome"
                      placeholder="Informe seu nome"
                      maxLength="100"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      required
                      fluid
                      label="Razão Social"
                      placeholder="Informe a razão social"
                      maxLength="100"
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                    />
                  </Grid.Column>
                  <Grid.Column>
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
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Field required>
                      <label>CPF</label>
                      <InputMask
                        mask="999.999.999-99"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      required
                      fluid
                      label="RG"
                      placeholder="Informe o RG"
                      maxLength="20" 
                      value={rg}
                      onChange={(e) => setRg(e.target.value)}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Field required>
                      <label>Data de Nascimento</label>
                      <InputMask
                        mask="99/99/9999"
                        maskChar={null}
                        placeholder="Ex: 20/03/1985"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid>

                <Divider section /> 

                <h3>Dados de Endereço</h3>
                <Grid columns={2} stackable>
                  <Grid.Column width={10}> 
                    <Form.Input
                      required
                      fluid
                      label="Rua"
                      placeholder="Informe sua Rua"
                      maxLength="150"
                      value={enderecoRua}
                      onChange={(e) => setEnderecoRua(e.target.value)}
                    />
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <Form.Input
                      required
                      fluid
                      label="Número"
                      placeholder="Número"
                      maxLength="10"
                      value={enderecoNumero}
                      onChange={(e) => setEnderecoNumero(e.target.value)}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      fluid
                      label="Complemento"
                      placeholder="Ex: Apt 101, Bloco A"
                      maxLength="100"
                      value={enderecoComplemento}
                      onChange={(e) => setEnderecoComplemento(e.target.value)}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      required
                      fluid
                      label="Bairro"
                      placeholder="Informe seu bairro"
                      maxLength="100"
                      value={enderecoBairro}
                      onChange={(e) => setEnderecoBairro(e.target.value)}
                    />
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <Form.Input
                      required
                      fluid
                      label="Cidade"
                      placeholder="Informe sua cidade"
                      maxLength="100"
                      value={enderecoCidade}
                      onChange={(e) => setEnderecoCidade(e.target.value)}
                    />
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <Form.Field required>
                      <label>CEP</label>
                      <InputMask
                        mask="99999-999"
                        value={enderecoCep}
                        onChange={(e) => setEnderecoCep(e.target.value)}
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      required
                      fluid
                      label="UF"
                      placeholder="UF (Ex: PE)"
                      maxLength="2"
                      value={enderecoUf}
                      onChange={(e) => setEnderecoUf(e.target.value)}
                    />
                  </Grid.Column>
                </Grid>
              </Form>

              {mensagemSucesso && (
                <Message
                  success
                  header="Cadastro Realizado!"
                  content="Dono cadastrado com sucesso."
                  style={{ marginTop: "20px" }}
                />
              )}

              {mensagemErro && (
                <Message
                  error
                  header="Erro no Cadastro"
                  content="Ocorreu um erro ao tentar cadastrar o Dono. Tente novamente."
                  style={{ marginTop: "20px" }}
                />
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