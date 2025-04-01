export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1743e3',
        secondary: '#0a1f6d',
        accent: '#00f7ff',
        prueba: '#08123b',
        bg: '#0f0f1a',
        text: '#eaeaea',
        navbar: '#1a1a2e',
        background: '#12122b',
        card: {
          bg: 'rgba(23, 67, 227, 0.1)'
        },
        glass: 'rgba(255, 255, 255, 0.05)',
        glassBorder: 'rgba(255, 255, 255, 0.1)'
      },
      fontFamily: {
        primary: ['Poppins', 'sans-serif']
      },
      backdropBlur: {
        xs: "2px",
        glass: "10px",
      },
    },
  },
  plugins: [],
};