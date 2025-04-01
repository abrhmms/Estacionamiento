import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ className, ...props }) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4", className)} {...props}>
      <div className="w-full max-w-md rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-8 shadow-lg backdrop-blur-sm">
        <form className="space-y-6">
          {/* Logo y título */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <a href="#" className="group flex flex-col items-center">
              <div className="flex size-12 items-center justify-center rounded-lg bg-[var(--color-card-bg)] p-2 group-hover:bg-[var(--color-primary)] transition-colors">
                <GalleryVerticalEnd className="size-6 text-[var(--color-accent)]" />
              </div>
              <span className="sr-only">SmartPark</span>
            </a>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">Bienvenido a SmartPark</h1>
            <p className="text-sm text-[var(--color-text)] opacity-80">
              ¿No tienes cuenta?{' '}
              <a href="#" className="py-3 text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-primary)] transition-colors">
                ¡Registrate!
              </a>
            </p>
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
                placeholder="*************"
                required
                className="bg-[var(--color-glass)] border-[var(--color-glass-border)] text-[var(--color-text)] placeholder:text-[var(--color-text)]/50 focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>
            <Button
              type="submit"
              className="gradient-bg hover:gradient-bg2 inline-block px-6 py-2 md:px-8 md:py-2 rounded-full text-white font-semibold tracking-wider shadow-lg shadow-[var(--color-primary)]/50 relative overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[var(--color-primary)]/80 z-[1] group w-full"
            >
              <span className="relative z-10">Iniciar Sesión</span>
              <span className="absolute inset-0 gradient-bg2 opacity-0 group-hover:opacity-80 transition-opacity duration-300"></span>
            </Button>
          </div>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-glass-border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--color-glass)] px-2 text-[var(--color-text)]/60">

              </span>
            </div>
          </div>

          {/* Apartado */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-[var(--color-glass-border)] bg-[var(--color-glass)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <label htmlFor="remember" className="ml-2 text-[var(--color-text)] cursor-pointer hover:text-[var(--color-accent)] transition-colors">
                Recuérdame
              </label>
            </div>

            <a
              href="#"
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] underline underline-offset-4 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[var(--color-text)]/60">
          Al usar este servicio, aceptas nuestro{' '}
          <a href="#" className="underline underline-offset-4 hover:text-[var(--color-accent)]">
            Reglamento de Estacionamiento
          </a>{' '}
          y{' '}
          <a href="#" className="underline underline-offset-4 hover:text-[var(--color-accent)]">
            Política de Datos Vehiculares
          </a>
        </div>
      </div>
    </div>
  )
}