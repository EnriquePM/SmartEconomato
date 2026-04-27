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
        primario: 'var(--text-principal)',
        secundario: 'var(--text-secundario)',
        terciario: 'var(--text-terciario)',
        acento: 'var(--color-acento)',
        fondo: 'var(--bg-pagina)',
        input: '#F1F5F9', 
        DEFAULT: '#DC2626',
        acento: '#DC2626', 
        'acento': '#DC2626',
        fondo: '#f4f7fa',        
        tarjeta: colors.white,   
   
      },
      borderRadius: {
        'panel': '2rem',              
        'pill': '30px',              
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)', 
      },
      spacing: {
        'sidebar': '15rem',           
      }
    },
  },
  plugins: [],
}