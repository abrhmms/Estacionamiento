import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <div className="min-h-screen bg-[#111124] text-[#eaeaea]">
      <BrowserRouter>
        <AuthProvider>
          {/* Navbar fuera de Routes para que siempre se muestre */}
          <Navbar />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;