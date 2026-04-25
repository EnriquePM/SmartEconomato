import { useState } from "react";
import { Plus, GraduationCap, Briefcase, Search } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Buscador } from "../components/ui/Buscador";
import { Select } from "../components/ui/Select";
import { useAdminUsuarios } from "../hooks/useAdminUsuarios";
import { ModalNuevoUsuario } from "../components/inventario/AdminUser/ModalAdminUsuarios";

const AdminUsuarios = () => {
  const { usuarios, filtros, alerta, loading, ...adminProps } = useAdminUsuarios();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const opcionesRoles = [
    { value: "todos", label: "Todos los roles" },
    { value: "alumno", label: "Alumnos" },
    { value: "profe", label: "Profesores" },
  ];

  return (
    <div className="space-y-0 animate-fade-in flex flex-col h-full gap-4">
    
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 pb-4">
        <div>
          <h1 >Gestión de Usuarios</h1>
          <h2 >Panel de administración para alumnos y profesores.</h2>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="!bg-acento">
          <Plus size={16} color="#ffffff" strokeWidth={3} className="mr-2" /> NUEVO USUARIO
        </Button>
      </header>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 shrink-0 mb-4 items-center">
        <div className="flex-1 w-full">
          <Buscador 
            value={filtros.busqueda} 
            onChange={filtros.setBusqueda} 
            placeholder="Buscar por nombre, apellidos o usuario..." 
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select 
            options={opcionesRoles} 
            value={filtros.filtroRol} 
            onChange={(val) => filtros.setFiltroRol(val)} 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 mb-6 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="p-4">Nombre Completo</th>
                <th className="p-4">Usuario</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.length > 0 ? (
                usuarios.map((u) => (
                  <tr key={u.id_usuario || u.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 font-bold text-gray-900 text-sm">
                      {u.nombre} {u.apellido1} {u.apellido2 || ''}
                    </td>
                    <td className="p-4">
                      <span className="font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] font-bold group-hover:bg-white transition-colors">
                        {u.username}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 font-medium">
                      {u.email || <span className="text-[10px] italic text-gray-300 uppercase tracking-tighter">Sin email</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        {String(u.rol).toLowerCase().includes("alumno") ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100 w-fit">
                              <GraduationCap size={13} strokeWidth={3} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Alumno</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 w-fit">
                            <Briefcase size={13} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Profesor</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-24 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={40} className="opacity-10 mb-2" />
                      <p className="text-xs font-black uppercase tracking-[0.2em]">No hay coincidencias</p>
                      <button 
                        onClick={() => { filtros.setBusqueda(""); filtros.setFiltroRol("todos"); }}
                        className="text-[10px] font-bold text-acento underline underline-offset-4 mt-2"
                      >
                        LIMPIAR FILTROS
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ModalNuevoUsuario 
          onClose={() => setIsModalOpen(false)} 
          adminProps={{ ...adminProps, alerta, loading }} 
        />
      )}
    </div>
  );
};

export default AdminUsuarios;