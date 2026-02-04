import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ¡Funciona! 🚀
        </h1>
        <p className="text-lg text-gray-600">
          Tailwind ya está listo en tu Economato.
        </p>
        <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition">
          Click de prueba
        </button>
      </div>
    </div>
  )
}

export default App