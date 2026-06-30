import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import ProtectedRoute from "../auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import CajaPage from "../pages/CajaPage";
import ComprasPage from "../pages/ComprasPage";
import DashboardPage from "../pages/DashboardPage";
import HistorialVentasPage from "../pages/HistorialVentasPage";
import LoginPage from "../pages/LoginPage";
import ProductosPage from "../pages/ProductosPage";
import ProveedoresPage from "../pages/ProveedoresPage";
import VentasPosPage from "../pages/VentasPosPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="ventas-pos" element={<VentasPosPage />} />
            <Route path="historial-ventas" element={<HistorialVentasPage />} />
            <Route path="caja" element={<CajaPage />} />
            <Route path="compras" element={<ComprasPage />} />
            <Route path="proveedores" element={<ProveedoresPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;