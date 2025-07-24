import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "semantic-ui-react";

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
        size="mini" 
        closeIcon
        className={`modal-gerenciador-expositor-base ${isFadingOut ? 'fade-out-modal' : ''}`}
        style={{ borderRadius: 16, padding: "1rem" }}
      >
        <Modal.Header style={{ fontSize: '1.5em', fontWeight: 600, textAlign: "center", marginBottom: '1rem' }}>
          Qual tipo de cadastro?
        </Modal.Header>
        <Modal.Content style={{ textAlign: "center", flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 0.5rem' }}> {/* Ajuste padding e adicione flex para centralizar */}
          <p style={{ fontSize: '1.1em', color: "#555", marginBottom: '1.5rem' }}> 
            Escolha como deseja continuar:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: '0.8rem', width: '100%', maxWidth: '250px' }}> 
            <Button 
              primary 
              fluid 
              onClick={() => handleNavigate("/form-dono")}
              style={{
                backgroundColor: '#3b82f6',
                borderColor: '#3b82f6',
                padding: '12px 16px',
                fontWeight: '600'
              }}
            >
              Gerenciador de Eventos
            </Button>
            <Button 
              secondary 
              fluid 
              onClick={() => handleNavigate("/form-cliente")}
              style={{
                backgroundColor: '#22c55e',
                borderColor: '#22c55e',
                color: '#ffffff',
                padding: '12px 16px',
                fontWeight: '600'
              }}
            >
              Expositor
            </Button>
            <Button 
              color="red"
              fluid 
              onClick={() => handleNavigate("/form-adm")}
              style={{
                backgroundColor: '#ef4444',
                borderColor: '#ef4444',
                color: '#ffffff',
                padding: '12px 16px',
                fontWeight: '600'
              }}
            >
              Administrador do Sistema
            </Button>
          </div>
        </Modal.Content>
        <Modal.Actions style={{ textAlign: "center", marginTop: '1rem' }}>
          <Button onClick={handleClose}>Fechar</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}