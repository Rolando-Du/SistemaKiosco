import { Navigate, Outlet } from "react-router";

import { estaAutenticado } from "../services/authService";

function ProtectedRoute() {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;