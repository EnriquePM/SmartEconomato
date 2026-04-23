import { Toaster } from 'sonner';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routes } from './app/router'
import { AuthProvider } from './context/AuthContext'



const router = createBrowserRouter(routes);

export default function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
