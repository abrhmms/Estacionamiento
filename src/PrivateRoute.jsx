import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element, role, ...rest }) => {
  const { user, loading, role: userRole } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Mostrar algo mientras carga
  }

  if (!user) {
    return <Navigate to="/login-form" />; // Si no está autenticado, redirige al login
  }

  // Si el rol no coincide, redirige al index (HeroSection)
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return <Route {...rest} element={element} />; // Aquí retornamos un Route con el element
};

export default PrivateRoute;
