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
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }

    } catch (error) {
      setError(error.message);
      console.error("Error al iniciar sesión:", error);
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
                <NavLink to="/register" className="text-sm text-[var(--color-text)] opacity-80">
                  ¿No tienes cuenta?{' '}
                  <span className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-primary)] transition-colors">
                    Regístrate
                  </span>
                </NavLink>
              </div>

              {/* Campos del formulario */}
              <div className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
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
                  className="w-full gradient-bg hover:gradient-bg2"
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