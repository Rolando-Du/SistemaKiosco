import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import ProductosPage from "../pages/ProductosPage";
import VentasPosPage from "../pages/VentasPosPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="ventas-pos" element={<VentasPosPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;