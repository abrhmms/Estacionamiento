import { motion } from "motion/react";
import parkingImage from "./assets/SMART-Parking.png"; // Asegúrate de que la ruta sea correcta


function App() {
  return (
    <div className="min-h-screen bg-[#111124] text-[#eaeaea] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 md:px-20 md:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1743e3] to-[#00f7ff] bg-clip-text text-transparent leading-normal"
            >
              SmartPark
            </motion.div>

            {/* Menú centrado */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {["Inicio", "Sobre Nosotros", "Contacto"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="group relative"
                >
                  <a
                    href="#"
                    className="text-base lg:text-lg font-medium hover:text-[#00f7ff] transition-colors duration-300 tracking-normal"
                  >
                    {item}
                  </a>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#1743e3] to-[#00f7ff] transition-all duration-300 group-hover:w-full" />
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="px-4 py-2 md:px-6 md:py-2 rounded-md font-medium bg-[#eaeaea] text-[#1a1a2e] hover:bg-[#00f7ff] transition-colors text-sm md:text-base"
            >
              Iniciar Sesión
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="relative min-h-screen overflow-hidden flex items-center px-6 md:px-[8%] pt-24 md:pt-[8%] pb-16">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(23,67,227,0.1)_0%,transparent_70%] z-0"></div>

        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute rounded-full bg-[#00f7ff]"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-[clamp(2rem,5vw,4rem)] leading-tight mb-4 md:mb-6 bg-gradient-to-r from-[#eaeaea] to-[#00f7ff] bg-clip-text text-transparent font-bold">
              Estacionamiento Inteligente
            </h1>

            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl md:text-3xl lg:text-[clamp(1.5rem,3vw,2.5rem)] mb-3 md:mb-4 text-white"
            >
              <strong>¡Aparta tu espacio!</strong>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-sm md:text-base lg:text-[clamp(0.9rem,1.5vw,1.1rem)] my-4 md:my-6 text-gray-300 leading-relaxed"
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum quas omnis voluptatem reprehenderit
              accusantium et hic modi ex, cupiditate iure iusto quod illum.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              href="parking.html"
              className="inline-block px-6 py-3 md:px-8 md:py-3 rounded-full text-white font-semibold tracking-wider bg-gradient-to-r from-[#1743e3] to-[#0a1f6d] shadow-lg shadow-[#1743e3]/50 relative overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[#1743e3]/80 z-[1] group"
            >
              Reserva tu Lugar
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-[100%] z-[-1]"></span>
            </motion.a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center w-full h-full -translate-x-7"
          >
            <motion.div
              className="relative w-[95vw] max-w-xl h-[70vh]"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,247,255,0.15)_0%,transparent_70%)] rounded-lg" />
              <img
                src={parkingImage}
                alt="Estacionamiento Inteligente"
                className="mt-16 w-full h-full object-cover rounded-lg"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(0, 247, 255, 0.3))"
                }}
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default App;