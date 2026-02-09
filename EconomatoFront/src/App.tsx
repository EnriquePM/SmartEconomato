<<<<<<< HEAD
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routes } from './app/router' 


const router = createBrowserRouter(routes);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
=======
import './App.css'
import LoginPage from './pages/LoginPage'
import Inventario from './pages/Inventario'
import IngresarProducto  from './pages/IngresarProducto'
function App() {
  return (
  // <LoginPage />
 // <Inventario/>
 <IngresarProducto/>
  )
}

export default App
>>>>>>> 1760322e19b628b52b9b5d5e2f50e9df7b7d27a1
