/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        'caption': ['0.7rem', { lineHeight: '1rem', fontWeight: '400' }],
      },
      fontFamily: {
       sans: ['Poppins', 'system-ui', 'sans-serif'],
     },

      colors: {
        // Esto le dice a Tailwind: "cuando veas 'text-principal', 
        // usa el valor de la variable CSS --text-principal"
        primario: 'var(--text-principal)',
        secundario: 'var(--text-secundario)',
        terciario: 'var(--text-terciario)',
        acento: 'var(--color-acento)',
        fondo: 'var(--bg-pagina)',
        input: '#F1F5F9', 
        DEFAULT: '#DC2626',
      

        acento: '#DC2626', 
        'acento': '#DC2626',
        // Superficies
        fondo: '#f4f7fa',        
        tarjeta: colors.white,        // Blanco Contenedor
   
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