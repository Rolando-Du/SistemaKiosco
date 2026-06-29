import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;