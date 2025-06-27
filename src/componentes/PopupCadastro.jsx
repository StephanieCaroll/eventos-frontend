import { Modal, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function PopupCadastro({ aberto, fechar }) {
  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(aberto);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (aberto) {
      setShouldRender(true);
      setIsFadingOut(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    } else {
      if (shouldRender) {
        setIsFadingOut(true);
        timerRef.current = setTimeout(() => {
          setShouldRender(false);
          setIsFadingOut(false);
          timerRef.current = null;
        }, 300);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [aberto, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  const handleClose = () => {
    fechar();
  };

  const handleNavigate = (rota) => {
    fechar();
    setTimeout(() => {
      navigate(rota);
    }, 150);
  };

  return (
    <div className={`custom-dimmer ${isFadingOut ? 'fade-out-dimmer' : ''}`}>
      <Modal
        open={true}
        onClose={handleClose}
        size="mini" // Mantém o Semantic UI Modal como "mini" para um tamanho inicial menor
        closeIcon
        className={`modal-gerenciador-expositor-base ${isFadingOut ? 'fade-out-modal' : ''}`}
        // Ajuste o padding para ser mais responsivo se necessário, ou deixe o CSS externo controlar
        style={{ borderRadius: 16, padding: "1rem" }} // Reduzi o padding um pouco para dar mais espaço
      >
        <Modal.Header style={{ fontSize: '1.5em', fontWeight: 600, textAlign: "center", marginBottom: '1rem' }}> {/* Use em ou vw/vh */}
          Qual tipo de cadastro?
        </Modal.Header>
        <Modal.Content style={{ textAlign: "center", flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 0.5rem' }}> {/* Ajuste padding e adicione flex para centralizar */}
          <p style={{ fontSize: '1.1em', color: "#555", marginBottom: '1.5rem' }}> {/* Use em ou vw/vh */}
            Escolha como deseja continuar:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: '0.8rem', width: '100%', maxWidth: '250px' }}> {/* Ajuste gap e adicione max-width para botões */}
            <Button primary fluid onClick={() => handleNavigate("/form-dono")}>
              Gerenciador
            </Button>
            <Button secondary fluid onClick={() => handleNavigate("/form-cliente")}>
              Expositor
            </Button>
            {/* <Button tertiary fluid onClick={() => handleNavigate("/form-adm")}>
              Administrador
            </Button> */}
          </div>
        </Modal.Content>
        <Modal.Actions style={{ textAlign: "center", marginTop: '1rem' }}>
          <Button onClick={handleClose}>Fechar</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}