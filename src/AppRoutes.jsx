// AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import HeroSection from "./components/HeroSection";
import FloatingElements from "./components/FloatingElements";

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
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

export default AppRoutes;