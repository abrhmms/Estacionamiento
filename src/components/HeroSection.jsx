import { motion } from 'motion/react';
import parkingImage from "../assets/SMART-Parking.png";
import { NavLink } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center px-6 md:px-[8%] pt-24 md:pt-[8%] pb-16">
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(23,67,227,0.1)_0%,transparent_70%] z-0"></div>

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

          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7, duration: 0.5 }}
  className="inline-block"
>
  <NavLink
    to="/ParkingManager"
    className="px-6 py-3 md:px-8 md:py-3 rounded-full text-white font-semibold tracking-wider bg-gradient-to-r from-[#1743e3] to-[#0a1f6d] shadow-lg shadow-[#1743e3]/50 relative overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[#1743e3]/80 z-[1] group"
  >
    Reserva tu Lugar
    <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-[100%] z-[-1]"></span>
  </NavLink>
</motion.div>
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
  );
};

export default HeroSection;
