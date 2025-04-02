import { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // 2. Obtener el rol desde Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userRole = userDoc.data()?.role || "user";
      // 3. Redirigir según el rol
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {
      let errorMessage = "Error desconocido";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "El formato del email es inválido";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Email o contraseña incorrectos";
          break;
        case "auth/too-many-requests":
          errorMessage = "Demasiados intentos. Cuenta temporalmente bloqueada";
          break;
        default:
          errorMessage = error.message;
      }

      setError(
        <div className="animate-fade-in  bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/10 border-l-4 border-[var(--color-accent)] p-4 mb-4 rounded-lg backdrop-blur-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-[var(--color-accent)] mr-3 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3 ">
              <h3 className="text-sm font-medium text-[var(--color-primary)]">
                Error al iniciar sesión
              </h3>
              <div className="mt-1 text-sm text-[var(--color-text)] opacity-90">
                {errorMessage}
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="text-xs text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      );

      console.error("Error de autenticación:", {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      });

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className={cn("relative min-h-screen bg-[var(--color-bg)] overflow-hidden", className)} {...props}>
      <div className="h-screen overflow-y-auto scrollbar-hidden pt-32 pb-8 px-4">
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-full max-w-md rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-8 shadow-lg backdrop-blur-sm">

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Logo y título */}
              <div className="flex flex-col items-center space-y-4 text-center">
                <a href="#" className="group flex flex-col items-center">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-[var(--color-card-bg)] p-2 group-hover:bg-[var(--color-primary)] transition-colors">
                    <GalleryVerticalEnd className="size-6 text-[var(--color-accent)]" />
                  </div>
                  <span className="sr-only">SmartPark</span>
                </a>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Iniciar Sesión</h1>
                <NavLink to="/register-form" className="text-sm text-[var(--color-text)] opacity-80">
                  ¿No tienes cuenta?{' '}
                  <span className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-primary)] transition-colors">
                    Regístrate
                  </span>
                </NavLink>
              </div>

              {/* Campos del formulario */}
              <div className="space-y-4">
                {error && (
                  <div className="fixed w-full top-0 bg-[#1a1a2e]/80 border-b border-white/10 px-6 py-4 md:px-20 md:py-6">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@ejemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[var(--color-glass)] border-[var(--color-glass-border)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[var(--color-glass)] border-[var(--color-glass-border)]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="gradient-bg hover:gradient-bg2 inline-block px-6 py-2 md:px-8 md:py-2 rounded-full text-white font-semibold tracking-wider shadow-lg shadow-[var(--color-primary)]/50 relative overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[var(--color-primary)]/80 z-[1] group w-full"
                >
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </Button>
              </div>

              {/* Opciones adicionales */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[var(--color-glass-border)]"
                  />
                  <Label htmlFor="remember" className="ml-2">
                    Recuérdame
                  </Label>
                </div>
                <NavLink
                  to="/forgot-password"
                  className="text-sm text-[var(--color-accent)] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </NavLink>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-[var(--color-text)]/60">
              Al iniciar sesión, aceptas nuestros{' '}
              <a href="#" className="underline hover:text-[var(--color-accent)]">
                Términos de Servicio
              </a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



<div className="relative min-h-screen bg-[var(--color-bg)]" style={{ paddingTop: '80px' }}>
  <div className="h-full overflow-y-auto pt-8 pb-8 px-4">
    <div className="flex items-center justify-center min-h-[calc(100vh-80px-4rem)]">
      
    </div>
  </div>
</div>


