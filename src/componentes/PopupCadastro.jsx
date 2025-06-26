import { Modal, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function PopupCadastro({ aberto, fechar }) {
  const navigate = useNavigate();
  // Estado para controlar se o modal deve estar montado no DOM
  const [shouldRender, setShouldRender] = useState(aberto);
  // Estado para controlar a classe de animação de saída
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timerRef = useRef(null); // Ref para o setTimeout

  useEffect(() => {
    if (aberto) {
      // Se 'aberto' for true, garante que o modal seja renderizado e não esteja animando para fora
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

  // Se o modal não deve ser renderizado, retorna null imediatamente
  if (!shouldRender) {
    return null;
  }

  // Função para lidar com o fechamento do modal
  const handleClose = () => {
    fechar();
  };

  // Função para navegar após o modal fechar com animação
  const handleNavigate = (rota) => {
    fechar(); 
    setTimeout(() => {
      navigate(rota);
    }, 150); // Um pequeno atraso
  };

  return (

    <div className={`custom-dimmer ${isFadingOut ? 'fade-out-dimmer' : ''}`}>
      <Modal
        open={true} 
        onClose={handleClose}
        size="mini"
        closeIcon

        className={`modal-gerenciador-expositor-base ${isFadingOut ? 'fade-out-modal' : ''}`}
        style={{ borderRadius: 16, padding: "1.5rem" }}
      >
        <Modal.Header style={{ fontSize: 24, fontWeight: 600, textAlign: "center" }}>
          Qual tipo de cadastro?
        </Modal.Header>
        <Modal.Content style={{ textAlign: "center" }}>
          <p style={{ fontSize: 18, color: "#555" }}>
            Escolha como deseja continuar:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
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