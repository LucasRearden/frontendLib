import api from "./api";

const normalizar = (u) => ({ ...u, _id: u._id ?? u.id });

export const obtenerUsuariosApi = async (signal) => {
    const { data } = await api.get("/usuarios", { signal });
    const lista = Array.isArray(data) ? data : (data.usuarios ?? []);
    return lista.map(normalizar);
};