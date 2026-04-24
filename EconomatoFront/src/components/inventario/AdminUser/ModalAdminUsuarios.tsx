import { X, UserPlus} from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { AlertModal } from "../../ui/AlertModal";

interface ModalNuevoUsuarioProps {
  onClose: () => void;
  adminProps: any; 
}

export const ModalNuevoUsuario = ({ onClose, adminProps }: ModalNuevoUsuarioProps) => {
  const { form, loading, handleSubmit, alerta } = adminProps;

  const opcionesRol = [
    { value: "alumno", label: "Alumno" },
    { value: "profe", label: "Profesor" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up border border-gray-100">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white">
          <div className="flex items-center p-2.5 gap-3">
            <div className="bg-acento p-2.5 rounded-xl text-white shadow-lg">
              <UserPlus size={25} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">
                Nuevo Registro
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Añadir nuevo usuario al sistema
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
            <X size={22} />
          </button>
        </div>

        {/* CONTENIDO FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="md:col-span-2">
              <Input 
                  type="text"
                  label="Segundo Apellido"
                  placeholder="Ej: Perez"
                  value={form.apellido2}
                  onChange={form.setApellido2}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
                type="email"
                label="Email (Opcional)"
                placeholder="alumno@escuela.com"
                value={form.email}
                onChange={form.setEmail}
            />
            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rol</label>
                <Select 
                    value={form.rol}
                    options={opcionesRol}
                    onChange={(val) => form.setRol(val as "alumno" | "profe")}
                />
            </div>
          </div>

          {form.rol === "alumno" && (
            <div className="animate-fade-in">
                <Input 
                    type="text"
                    label="Curso"
                    placeholder="Ej: 1º Cocina"
                    value={form.curso}
                    onChange={form.setCurso}
                />
            </div>
          )}

          {/* FOOTER INTERNO */}
          <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
            <Button variant="gris" onClick={onClose} type="button">
              CANCELAR
            </Button>
            <Button type="submit" loading={loading} variant="primario" className="px-10 !bg-acento">
              {loading ? "CREANDO..." : "REGISTRAR USUARIO"}
            </Button>
          </div>
        </form>
      </div>

      <AlertModal 
          isOpen={alerta.isOpen}
          type={alerta.type}
          title={alerta.title}
          message={alerta.message}
          onConfirm={() => {
            alerta.onConfirm();
            if(alerta.type === 'success') onClose(); // Cerramos modal si tuvo éxito
          }}
          onCancel={alerta.cerrar}
          confirmText={alerta.type === 'confirm' ? "REGISTRAR" : "ENTENDIDO"}
      />
    </div>
  );
};