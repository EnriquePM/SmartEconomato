import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Users, UserPlus, GraduationCap, Briefcase } from "lucide-react";

// 1. ACTUALIZAMOS LA INTERFAZ (Añadimos username)
interface Usuario {
  id_usuario: number;
  username: string;
  nombre: string;
  apellido1: string;
  apellido2: string | null;
  email: string | null;
  rol: {
    nombre: string; 
  };
}

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  
  // ESTADOS DEL FORMULARIO
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState(""); 
  const [apellido2, setApellido2] = useState(""); 
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("alumno"); 
  const [curso, setCurso] = useState("");   
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/usuarios");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !apellido1) {
        alert("El nombre y el primer apellido son obligatorios.");
        return; 
    }

    setLoading(true);

    const endpoint = rol === "alumno" 
        ? "http://localhost:3000/api/auth/register/alumno"
        : "http://localhost:3000/api/auth/register/profesor";

    const body = {
        nombre,
        apellido1, 
        apellido2: apellido2 || undefined, 
        email: email || undefined,
        curso: rol === "alumno" ? (curso || "1º Curso") : undefined,
        asignaturas: rol === "profe" ? "General" : undefined 
    };

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (res.ok) {
            alert(`¡Usuario creado con éxito!\n\n👤 Usuario: ${data.username}\n🔑 Contraseña temporal: Economato123`);
            cargarUsuarios(); 
            
            setNombre("");
            setApellido1("");
            setApellido2("");
            setEmail("");
            setCurso("");
        } else {
            alert(data.error || "Error al crear usuario");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor");
    } finally {
        setLoading(false);
    }
  };

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
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre *</label>
                <input 
                    type="text" 
                    placeholder="Ej: Juan" 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" 
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Primer Apellido *</label>
                <input 
                    type="text" 
                    placeholder="Ej: García" 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" 
                    value={apellido1}
                    onChange={e => setApellido1(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Segundo Apellido</label>
                <input 
                    type="text" 
                    placeholder="Ej: Pérez" 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" 
                    value={apellido2}
                    onChange={e => setApellido2(e.target.value)}
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
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rol</label>
                    <select 
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-gray-900 transition-all"
                        value={rol}
                        onChange={e => setRol(e.target.value)}
                    >
                        <option value="alumno">Alumno</option>
                        <option value="profe">Profesor</option>
                    </select>
                </div>
                {rol === "alumno" && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Curso</label>
                        <input 
                            type="text" 
                            placeholder="Ej: 1º Cocina" 
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-all" 
                            value={curso}
                            onChange={e => setCurso(e.target.value)}
                        />
                    </div>
                )}
            </div>
          </div>

          <div className="pt-2">
            <Button text={loading ? "Creando..." : "Crear Usuario"} onClick={() => {}} />
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
                    <tr key={u.id_usuario} className="hover:bg-gray-50 transition-colors">
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
                            {u.rol?.nombre.toLowerCase().includes("alumno") ? (
                                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full w-fit">
                                    <GraduationCap size={16} />
                                    <span className="text-xs font-bold uppercase">Alumno</span>
                                </div>
                            ) : u.rol?.nombre.toLowerCase().includes("profesor") ? (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit">
                                    <Briefcase size={16} />
                                    <span className="text-xs font-bold uppercase">Profe</span>
                                </div>
                            ) : (
                                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">{u.rol?.nombre}</span>
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