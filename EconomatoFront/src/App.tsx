import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routes } from './app/router' 

// Creamos el router aquí para que el main quede más corto
const router = createBrowserRouter(routes);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}