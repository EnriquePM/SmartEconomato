import { Button } from "../components/ui/Button";
import { Users, UserPlus, GraduationCap, Briefcase } from "lucide-react";

const AdminUsuarios = () => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🎨 Lógica pendiente de conectar.");
  };

  return (
    <main className="w-full space-y-8">
      
      {/* 1. CABECERA (LIMPIA, SIN ICONO) */}
      <header className="text-left">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-500 mt-2">Panel de administración para alumnos y profesores.</p>
      </header>

      {/* 2. FORMULARIO */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
            <UserPlus className="text-gray-500" size={20} />
            <h2 className="text-lg font-bold text-gray-800">Nuevo Registro</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
                <input type="text" placeholder="Ej: Laura" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Apellidos</label>
                <input type="text" placeholder="Ej: García Martínez" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email (Opcional)</label>
                <input type="email" placeholder="alumno@escuela.com" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Rol Asignado</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-gray-900 transition-all">
                    <option value="alumno">Alumno</option>
                    <option value="profe">Profesor / Admin</option>
                </select>
            </div>
          </div>

          <div className="pt-2">
            <Button text="Crear Usuario" onClick={() => {}} />
          </div>
        </form>
      </section>

      {/* 3. TABLA DE USUARIOS */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Users size={18} /> Listado de Usuarios
            </h3>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Vista Previa</span>
        </div>
        
        <table className="w-full text-left">
            <thead className="bg-white text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                    <th className="p-4">Nombre Completo</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Rol</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">Ana Pérez López</td>
                    <td className="p-4 text-gray-500">ana.perez@cole.com</td>
                    <td className="p-4">
                        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full w-fit">
                            <GraduationCap size={16} /> {/* Icono Alumno */}
                            <span className="text-xs font-bold uppercase">Alumno</span>
                        </div>
                    </td>
                </tr>

                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">Carlos Ruíz Gil</td>
                    <td className="p-4 text-gray-500 text-xs italic">No registrado</td>
                    <td className="p-4">
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit">
                            <Briefcase size={16} /> {/* Icono Profe */}
                            <span className="text-xs font-bold uppercase">Profe</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
      </section>
    </main>
  );
};

export default AdminUsuarios;