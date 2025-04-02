import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { auth } from "../lib/firebase";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, role, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const menuItems = [
    { name: "Inicio", path: "/" },
    { name: "Sobre Nosotros", path: "/sobre-nosotros" },
    { name: "Contacto", path: "/contacto" },
    { name: "Mis Reservas", path: "/mis-reservas" },
    ...(user && role === 'admin' ? [{ name: "Admin", path: "/admin" }] : [])
  ];

  if (loading) {
    return (
      <nav className="fixed w-full top-0 z-50 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto h-10"></div>
      </nav>
    );
  }

  return (
    <nav className="fixed w-full top-0 z-50 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6 md:py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-12 md:h-auto">
          {/* Logo y Botón Hamburguesa */}
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <NavLink
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-[#1743e3] to-[#00f7ff] bg-clip-text text-transparent"
              >
                SmartPark
              </NavLink>
            </motion.div>
          </div>

          {/* Menú Desktop (hidden en móviles) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="group relative"
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `text-base font-medium hover:text-[#00f7ff] transition-colors ${
                      isActive ? "text-[#00f7ff]" : "text-white/90"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#1743e3] to-[#00f7ff] transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
          </div>

          {/* Botones de sesión */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <motion.button
                  onClick={handleLogout}
                  className="hidden md:block px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r from-[#ff4d4d] to-[#f02e2e] shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cerrar sesión
                </motion.button>
                <span className="hidden md:inline text-white/80 text-sm ml-2">
                  {user.email}
                </span>
              </>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <NavLink
                  to="/login-form"
                  className="hidden md:block px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r from-[#1743e3] to-[#0a1f6d] shadow-lg transition-all"
                >
                  Iniciar Sesión
                </NavLink>
              </motion.button>
            )}

            {/* Botón Hamburguesa (solo móvil) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-white focus:outline-none"
              aria-label="Menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menú Mobile (AnimatePresence para animación) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-2 pb-4 space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive 
                          ? 'text-[#00f7ff] bg-[#ffffff08]' 
                          : 'text-white/90 hover:text-[#00f7ff] hover:bg-[#ffffff05]'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/90 hover:text-[#ff4d4d] hover:bg-[#ffffff05]"
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <NavLink
                    to="/login-form"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:text-[#00f7ff] hover:bg-[#ffffff05]"
                  >
                    Iniciar Sesión
                  </NavLink>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;