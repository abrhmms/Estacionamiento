import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './AuthContext';  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Envolvemos la aplicación en AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);
