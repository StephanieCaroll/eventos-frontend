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

  if (!isAuthReady) {
    console.log('[ProtectedRoute] AuthContext não está pronto. Renderizando null.');

    return null; 
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Usuário não autenticado. Redirecionando para /.');
    return <Navigate to="/" />; 
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
    console.log('[ProtectedRoute] Verificando papéis. Usuário tem papel requerido:', hasRequiredRole);
    if (!hasRequiredRole) {
      console.warn("[ProtectedRoute] Acesso negado: Usuário não possui o papel necessário.");
      return <Navigate to="/" />; 
    }
  }

  console.log('[ProtectedRoute] Acesso concedido. Renderizando componente filho.');
  return children;
};
