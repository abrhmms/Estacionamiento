import { motion } from 'motion/react';
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 md:px-20 md:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo (ahora con Link) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NavLink
              to="/"
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1743e3] to-[#00f7ff] bg-clip-text text-transparent leading-normal"
            >
              SmartPark
            </NavLink>
          </motion.div>

          {/* Menú con NavLinks */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {[
              { name: "Inicio", path: "/" },
              { name: "Sobre Nosotros", path: "/sobre-nosotros" },
              { name: "Contacto", path: "/contacto" }
            ].map((item, index) => (
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
                    `text-base lg:text-lg font-medium hover:text-[#00f7ff] transition-colors duration-300 tracking-normal ${isActive ? "text-[#00f7ff]" : ""
                    }`
                  }
                >
                  {item.name}
                </NavLink>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#1743e3] to-[#00f7ff] transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <NavLink
              to="/login-form"
              className="inline-block px-4 py-3 md:px-6 md:py-2 rounded-full text-white font-semibold tracking-wider bg-gradient-to-r from-[#1743e3] to-[#0a1f6d] shadow-lg shadow-[#1743e3]/50 relative overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[#1743e3]/80 z-[1] group"            >
              Iniciar Sesión
            </NavLink>
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;