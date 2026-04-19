import { Button } from "../components/ui/Button";
import { Users, UserPlus, GraduationCap, Briefcase } from "lucide-react";
import { useAdminUsuarios } from "../hooks/useAdminUsuarios";

const AdminUsuarios = () => {
    const { usuarios, loading, form, handleSubmit } = useAdminUsuarios();



  return (
    <main className="w-full space-y-8">
      
      <header className="text-left flex items-center gap-3">
        <div className="p-3 bg-gray-100 rounded-lg text-gray-800">
            <Users size={32} />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de Usuarios</h1>
            <p className="text-gray-500">Panel de administracion para alumnos y profesores.</p>
        </div>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
            <UserPlus className="text-gray-500" size={20} />
            <h2 className="text-lg font-bold text-gray-800">Nuevo Registro</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre *</label>
                <input 
                    type="text" 
                    placeholder="Ej: Juan" 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" 
                    value={form.nombre}
                    onChange={e => form.setNombre(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Primer Apellido *</label>
                <input 
                    type="text" 
                    placeholder="Ej: Garcia" 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" 
                    value={form.apellido1}
                    onChange={e => form.setApellido1(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Segundo Apellido</label>
                <input 
                    type="text" 
                    placeholder="Ej: Perez" 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" 
                    value={form.apellido2}
                    onChange={e => form.setApellido2(e.target.value)}
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email (Opcional)</label>
                <input 
                    type="email" 
                    placeholder="alumno@escuela.com" 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" 
                    value={form.email}
                    onChange={e => form.setEmail(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rol</label>
                    <select 
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-gray-900 transition-all"
                        value={form.rol}
                        onChange={e => form.setRol(e.target.value as "alumno" | "profe")}
                    >
                        <option value="alumno">Alumno</option>
                        <option value="profe">Profesor</option>
                    </select>
                </div>
                {form.rol === "alumno" && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Curso</label>
                        <input 
                            type="text" 
                            placeholder="Ej: 1º Cocina" 
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" 
                            value={form.curso}
                            onChange={e => form.setCurso(e.target.value)}
                        />
                    </div>
                )}
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" loading={loading}>
              {loading ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </section>

      {/* 3. TABLA DE USUARIOS */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Users size={18} /> Listado de Usuarios ({usuarios.length})
            </h3>
        </div>
        
        <table className="w-full text-left">
            <thead className="bg-white text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                    <th className="p-4">Nombre Completo</th>
                    <th className="p-4">Usuario</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Rol</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {usuarios.map((u) => (
                    <tr key={u.id_usuario || u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">
                            {u.nombre} {u.apellido1} {u.apellido2 || ''}
                        </td>
                        
                        <td className="p-4">
                            <span className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 text-sm">
                                {u.username}
                            </span>
                        </td>

                        <td className="p-4 text-gray-500">
                            {u.email || <span className="text-xs italic">Sin email</span>}
                        </td>
                        <td className="p-4">
                            {String(u.rol).toLowerCase().includes("alumno") ? (
                                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full w-fit">
                                    <GraduationCap size={16} />
                                    <span className="text-xs font-bold uppercase">Alumno</span>
                                </div>
                            ) : String(u.rol).toLowerCase().includes("profesor") ? (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit">
                                    <Briefcase size={16} />
                                    <span className="text-xs font-bold uppercase">Profe</span>
                                </div>
                            ) : (
                                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">{String(u.rol)}</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </section>
    </main>
  );


};

export default AdminUsuarios;
