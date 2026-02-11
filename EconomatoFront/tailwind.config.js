/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        'size-label': ['0.8rem', { lineHeight: '1rem', fontWeight: '700' }], //label
        'size-input': ['0.85rem', { lineHeight: '1.25rem' }], //placeholder e input
        'caption': ['0.8rem', { lineHeight: '1rem', fontWeight: '400' }], //footer
      },
      colors: {
        // Colores de marca basados en tus componentes
        primario: colors.black,       // El negro de tus botones y títulos
        secundario: colors.gray[500], // El gris de tus subtítulos, placeholder y footer
        acento: '#DC2626', // Focus
        // Superficies
        fondo: '#F0F2F5',             // Tu color de fondo personalizado
        tarjeta: colors.white,        // El blanco de tus contenedores
        input: colors.gray[100],      // El fondo de tus inputs y filas de tabla
      },
      borderRadius: {
        'panel': '2rem',              // El rounded-[2rem] de tu layout
        'pill': '25px',               // El rounded-[30px] de tus inputs
      },
      spacing: {
        'sidebar': '15rem',           // El sm:ml-60 (60 * 0.25rem = 15rem)
      },
      boxShadow: {
        'focus-rojo': '0 -4px 10px -2px rgba(220, 38, 38, 0.1)',
      }
    },
  },
  plugins: [],
}