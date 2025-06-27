// Componente que protege rotas, redirecionando usuários não autenticados ou sem permissão.
import React, { useContext } from 'react'; 
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext'; 

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRoles, isAuthReady, userName } = useContext(AuthContext); 

  console.log('[ProtectedRoute] Verificando acesso...');
  console.log('[ProtectedRoute] isAuthReady:', isAuthReady);
  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated);
  console.log('[ProtectedRoute] userRoles:', userRoles);
  console.log('[ProtectedRoute] userName:', userName);
  console.log('[ProtectedRoute] allowedRoles (para esta rota):', allowedRoles);

  // Espera que a verificação inicial de autenticação seja concluída.
  // Isso evita redirecionamentos prematuros antes que o status de login seja conhecido.
  if (!isAuthReady) {
    console.log('[ProtectedRoute] AuthContext não está pronto. Renderizando null.');
    // Pode exibir um spinner de carregamento ou uma tela de carregamento global aqui
    return null; 
  }

  // Se o usuário não estiver autenticado, redireciona para a página de início (/)
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Usuário não autenticado. Redirecionando para /.');
    return <Navigate to="/" />; // CORREÇÃO AQUI: Redireciona para a rota inicial
  }

  // Se 'allowedRoles' foi fornecido (ou seja, a rota exige papéis específicos),
  // verifica se o usuário possui *algum* dos papéis permitidos.
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
    console.log('[ProtectedRoute] Verificando papéis. Usuário tem papel requerido:', hasRequiredRole);
    if (!hasRequiredRole) {
      // Se o usuário não tiver nenhum dos papéis necessários, exibe um aviso no console
      // e o redireciona para a home do expositor (HomeExpositor).
      console.warn("[ProtectedRoute] Acesso negado: Usuário não possui o papel necessário.");
      return <Navigate to="/" />; 
    }
  }

  // Se o usuário estiver autenticado e tiver os papéis necessários (se especificado),
  // renderiza os componentes filhos da rota.
  console.log('[ProtectedRoute] Acesso concedido. Renderizando componente filho.');
  return children;
};
