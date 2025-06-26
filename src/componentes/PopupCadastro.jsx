import { Modal, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

export default function PopupCadastro({ aberto, fechar }) {
  const navigate = useNavigate();

  const irPara = (rota) => {
    fechar();
    navigate(rota);
  };

  return (
    <Modal
      open={aberto}
      onClose={fechar}
      size="mini"
      dimmer="inverted"
      closeIcon
      style={{ borderRadius: 16, padding: "1.5rem", textAlign: "center" }}
    >
      <Modal.Header style={{ fontSize: 20, fontWeight: 600 }}>
        Qual tipo de cadastro?
      </Modal.Header>
      <Modal.Content>
        <p style={{ fontSize: 15, color: "#555" }}>
          Escolha como deseja continuar:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <Button primary fluid onClick={() => irPara("/form-dono")}>
            Gerenciador
          </Button>
          <Button secondary fluid onClick={() => irPara("/form-cliente")}>
            Expositor
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
