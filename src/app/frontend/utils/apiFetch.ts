export async function apiFetch(
    url: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("token");

    return fetch(`/backend/api/protected/${url}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    });
}