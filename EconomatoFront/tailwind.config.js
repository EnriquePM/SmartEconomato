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
        DEFAULT: '#DC2626',
        primario: colors.black,      
        secundario: colors.gray[500], // El gris de tus subtítulos, placeholder y footer
        acento: '#DC2626', 
        'acento': '#DC2626',
        // Superficies
        fondo: '#f4f7fa', 
        surface:'#f4f7fa',         
        tarjeta: colors.white,        // Blanco Contenedor
        input: colors.gray[100],      // El fondo de tus inputs y filas de tabla
      },
      content: {
          title: '#111827', // Casi negro para h1, h2
          body: '#4B5563',  // Gris oscuro para lectura
          sub: '#9CA3AF',   // Gris claro para detalles
        },
      borderRadius: {
        'panel': '2rem',              
        'pill': '30px',              
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)', // La sombra Apple que querías
      },
      spacing: {
        'sidebar': '15rem',           
      }
    },
  },
  plugins: [],
}