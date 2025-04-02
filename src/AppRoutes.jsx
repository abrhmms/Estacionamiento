import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import HeroSection from "./components/HeroSection";
import FloatingElements from "./components/FloatingElements";
import ParkingManager from "./components/ParkingManager/ParkingManager";
import { useAuth } from "./AuthContext";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Usuarios from "./admin/usuarios";
import Estacionamientos from "./admin/Estacionamientos";
import Areas from "./admin/Areas";
import Espacios from "./admin/Espacios";
import MisReservas from './components/ParkingManager/mis-reservas';

function AppRoutes() {
  const { user, loading, role: userRole } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <>
            <HeroSection />
            <FloatingElements />
          </>
        } 
      />
      <Route path="/login-form" element={<LoginForm />} />
      <Route path="/register-form" element={<RegisterForm />} />
      <Route path="/ParkingManager/*" element={<ParkingManager />} />
      <Route path="/mis-reservas" element={<MisReservas />} />

      {/* Rutas de administración */}
      <Route 
        path="/admin" 
        element={
          user && userRole === "admin" ? (
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          ) : (
            <Navigate to="/login-form" />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="estacionamientos" element={<Estacionamientos />} />
        <Route path="areas" element={<Areas />} />
        <Route path="espacios" element={<Espacios />} />
        <Route path="usuarios" element={<Usuarios />} />
      </Route>

      {/* Ruta de redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;