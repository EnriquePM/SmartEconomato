import Swal from 'sweetalert2';
import { toast } from 'sonner';
import type {
    ChangePasswordPayload,
    LoginPayload,
    LoginResponse,
    Usuario,
} from "../models/user.model";

const API_URL = "/api";

export const getToken = (): string | null => {
    return localStorage.getItem("token");
};

export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getToken();
    const headers = new Headers(options.headers || {});

    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                return new Promise((resolve) => {
                    Swal.fire({
                        title: 'SESIÓN EXPIRADA',
                        html: `<p style="font-size: 1.1rem; padding: 10px 20px;">
                                Tu sesión ha caducado por motivos de seguridad. 
                                Por favor, vuelve a iniciar sesión para continuar trabajando.
                               </p>`,
                        icon: 'warning',
                        iconColor: '#DC2626',
                        width: '700px',
                        padding: '2em',
                        confirmButtonText: 'ENTENDIDO, IR AL LOGIN',
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        customClass: {
                            confirmButton: `
                                py-4 px-8 rounded-full flex items-center justify-center gap-3
                                font-bold text-[12px] uppercase tracking-[0.1em]
                                transition-all duration-300 active:scale-[0.96]
                                bg-[#DC2626] text-white hover:bg-red-700
                            `
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "/login";
                        }
                    });
                });
            }

            if (response.status >= 500) {
                if (!window.location.pathname.includes("/mantenimiento")) {
                    window.location.href = "/mantenimiento";
                }
                return new Promise(() => {}); 
            }
        }

        return response;

    } catch (error) {
        toast.error("Error de conexión", {
            description: "No se pudo conectar con el servidor. Revisa tu conexión a internet.",
            duration: 5000,
        });
        throw error; 
    }
};

const parseJson = async <T>(response: Response): Promise<T | null> => {
    try {
        return (await response.json()) as T;
    } catch {
        return null;
    }
};

const getErrorMessage = (payload: unknown, fallback: string): string => {
    if (payload && typeof payload === "object") {
        const candidate = (payload as Record<string, unknown>).error ??
            (payload as Record<string, unknown>).mensaje;
        if (typeof candidate === "string" && candidate.trim()) {
            return candidate;
        }
    }
    return fallback;
};

type RawUsuario = Omit<Partial<Usuario>, "rol"> & {
    rol?: string | { nombre?: string };
};

const mapUsuario = (usuario: RawUsuario): Usuario => {
    const rol =
        typeof usuario.rol === "string"
            ? usuario.rol
            : usuario.rol?.nombre || "Alumno";

    return {
        id: usuario.id ?? usuario.id_usuario ?? 0,
        id_usuario: usuario.id_usuario,
        username: usuario.username || "",
        nombre: usuario.nombre || "",
        apellido1: usuario.apellido1 || "",
        apellido2: usuario.apellido2,
        email: usuario.email,
        rol,
    };
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await parseJson<LoginResponse>(response);

    if (!response.ok || !data) {
        throw new Error(getErrorMessage(data, "Ocurrio un error al iniciar sesion"));
    }

    const mappedUsuario = data.usuario ? mapUsuario(data.usuario) : undefined;

    return {
        ...data,
        usuario: mappedUsuario,
    };
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await parseJson<unknown>(response);
    if (!response.ok) {
        throw new Error(getErrorMessage(data, "Error al cambiar la contrasena"));
    }
};
