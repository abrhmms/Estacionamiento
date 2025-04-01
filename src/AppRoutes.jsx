// AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import HeroSection from "./components/HeroSection";
import FloatingElements from "./components/FloatingElements";
import ParkingManager from "./components/ParkingManager/index";

function AppRoutes() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <>
            <HeroSection />
            <FloatingElements />
            {/* Otros componentes de tu home */}
          </>
        } 
      />
      <Route path="/login-form" element={<LoginForm />} />
      <Route path="/register-form" element={<RegisterForm />}/>
      <Route path="/ParkingManager" element={<ParkingManager/>}/>    </Routes>
  );
}

export default AppRoutes;