import api from "./api";

const normalizar = (c) => ({ ...c, _id: c._id ?? c.id });

export const obtenerCategoriasApi = async (signal) => {
    const { data } = await api.get("/categorias", { signal });
    const lista = Array.isArray(data) ? data : (data.categorias ?? []);
    return lista.map(normalizar);
};

export const crearCategoriaApi = async (nombre) => {
    const { data } = await api.post("/categorias", { nombre });
    return normalizar(data.categoria ?? data);
};

export const actualizarCategoriaApi = async (id, nombre) => {
    const { data } = await api.put(`/categorias/${id}`, { nombre });
    return normalizar(data.categoria ?? data);
};

export const borrarCategoriaApi = async (id) => {
    await api.delete(`/categorias/${id}`);
};