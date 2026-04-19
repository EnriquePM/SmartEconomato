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

    return fetch(url, {
        ...options,
        headers,
    });
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
