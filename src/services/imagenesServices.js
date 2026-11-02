import api from "./api";

// Sube una imagen en base64 (data URL). Devuelve { secure_url, public_id }
export const subirImagenApi = async (base64) => {
    const { data } = await api.post("/images", { file: base64 });
    return data;
};

export const borrarImagenApi = async (publicId) => {
    await api.delete(`/images/${encodeURIComponent(publicId)}`);
};