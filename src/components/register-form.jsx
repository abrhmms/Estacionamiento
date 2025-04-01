import { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role: "user", 
        createdAt: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Error al registrar:", error);
    }
  };

  return (
    <div className={cn("relative min-h-screen bg-[var(--color-bg)] overflow-hidden", className)} {...props}>
      <div className="h-screen overflow-y-auto scrollbar-hidden pt-32 pb-8 px-4">
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-full max-w-md rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-8 shadow-lg backdrop-blur-sm">
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Logo y título */}
              <div className="flex flex-col items-center space-y-4 text-center">
                <a href="#" className="group flex flex-col items-center">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-[var(--color-card-bg)] p-2 group-hover:bg-[var(--color-primary)] transition-colors">
                    <GalleryVerticalEnd className="size-6 text-[var(--color-accent)]" />
                  </div>
                  <span className="sr-only">SmartPark</span>
                </a>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Registro en SmartPark</h1>
                <NavLink to="/login-form" className="text-sm text-[var(--color-text)] opacity-80">
                  ¿Ya tienes cuenta?{' '}
                  <span className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-primary)] transition-colors">
                    ¡Inicia Sesión!
                  </span>
                </NavLink>
              </div>

              {/* Formulario */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[var(--color-text)]" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@ejemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[var(--color-glass)] border-[var(--color-glass-border)] text-[var(--color-text)] placeholder:text-[var(--color-text)]/50 focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--color-text)]" htmlFor="password">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="•••••••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[var(--color-glass)] border-[var(--color-glass-border)] text-[var(--color-text)] placeholder:text-[var(--color-text)]/50 focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                  type="submit"
                  className="gradient-bg hover:gradient-bg2 inline-block px-6 py-2 md:px-8 md:py-2 rounded-full text-white font-semibold tracking-wider shadow-lg shadow-[var(--color-primary)]/50 relative overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[var(--color-primary)]/80 z-[1] group w-full"
                >
                  <span className="relative z-10">Crear Cuenta</span>
                  <span className="absolute inset-0 gradient-bg2 opacity-0 group-hover:opacity-80 transition-opacity duration-300"></span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}