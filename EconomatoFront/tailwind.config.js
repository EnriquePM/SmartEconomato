/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        'caption': ['0.7rem', { lineHeight: '1rem', fontWeight: '400' }],
      },
      colors: {
        // Colores de marca basados en tus componentes
        primario: colors.black,       // El negro de tus botones y títulos
        secundario: colors.gray[500], // El gris de tus subtítulos, placeholder y footer
        acento: '#DC2626', // Focus
        'brand-red': '#ff5758',
        'acento': '#DC2626',
        // Superficies
        fondo: '#f4f7fa',             // Tu color de fondo personalizado
        tarjeta: colors.white,        // El blanco de tus contenedores
        input: colors.gray[100],      // El fondo de tus inputs y filas de tabla
      },
      borderRadius: {
        'panel': '2rem',              // El rounded-[2rem] de tu layout
        'pill': '30px',               // El rounded-[30px] de tus inputs
      },
      spacing: {
        'sidebar': '15rem',           // El sm:ml-60 (60 * 0.25rem = 15rem)
      }
    },
  },
  plugins: [],
}