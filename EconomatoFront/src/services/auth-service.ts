export const getToken = (): string | null => {
    return localStorage.getItem("token");
};

export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getToken();
    
    // Convertir headers a objeto Headers para manipularlo fácilmente
    const headers = new Headers(options.headers || {});

    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    const newOptions: RequestInit = {
        ...options,
        headers,
    };

    return fetch(url, newOptions);
};
