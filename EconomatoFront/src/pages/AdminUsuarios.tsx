import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input"; 
import { Select } from "../components/ui/select"; 
import { Users, UserPlus, GraduationCap, Briefcase } from "lucide-react";
import { useAdminUsuarios } from "../hooks/useAdminUsuarios";

const AdminUsuarios = () => {
  const { usuarios, loading, form, handleSubmit } = useAdminUsuarios();

  const opcionesRol = [
    { value: "alumno", label: "Alumno" },
    { value: "profe", label: "Profesor" },
  ];

  return (
    <main className="w-full space-y-8">
      
      <header className="text-left flex items-center gap-3">
        <div className="p-3 bg-gray-100 rounded-lg text-gray-800">
            <Users size={32} />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-500">Panel de administración para alumnos y profesores.</p>
        </div>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
            <UserPlus className="text-gray-500" size={20} />
            <h2 className="text-lg font-bold text-gray-800">Nuevo Registro</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
                type="text"
                label="Nombre *"
                placeholder="Ej: Juan"
                value={form.nombre}
                onChange={form.setNombre}
            />
            <Input 
                type="text"
                label="Primer Apellido *"
                placeholder="Ej: Garcia"
                value={form.apellido1}
                onChange={form.setApellido1}
            />
            <Input 
                type="text"
                label="Segundo Apellido"
                placeholder="Ej: Perez"
                value={form.apellido2}
                onChange={form.setApellido2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
                type="email"
                label="Email (Opcional)"
                placeholder="alumno@escuela.com"
                value={form.email}
                onChange={form.setEmail}
            />
            
            <div className="grid grid-cols-2 gap-4 items-end">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-500 ml-1">Rol</label>
                    <Select 
                        value={form.rol}
                        options={opcionesRol}
                        onChange={(val) => form.setRol(val as "alumno" | "profe")}
                    />
                </div>

                {form.rol === "alumno" && (
                    <Input 
                        type="text"
                        label="Curso"
                        placeholder="Ej: 1º Cocina"
                        value={form.curso}
                        onChange={form.setCurso}
                    />
                )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" loading={loading} className="px-10">
              {loading ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </section>

      {/* TABLA DE USUARIOS */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Users size={18} /> Listado de Usuarios ({usuarios.length})
            </h3>
        </div>
        
        <div className="overflow-x-auto">
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
                                ) : (
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit">
                                        <Briefcase size={16} />
                                        <span className="text-xs font-bold uppercase">Profe</span>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>
    </main>
  );
};

export default AdminUsuarios;