import { useEffect, useId, useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { borrarImagenApi, subirImagenApi } from "../services/imagenesServices";
import { mensajeDeError } from "../utils/errores";

const MAX_MB = 2.5; // Vercel limita el body a ~4.5MB y el base64 pesa ~33% más

const SubirImagen = ({ handleImgURL, handleImgPublicId, resetKey }) => {
    const [archivo, setArchivo] = useState(null);
    const [preview, setPreview] = useState("");
    const [imagenSubida, setImagenSubida] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputId = useId();

    // Al cambiar resetKey se limpia todo (por ejemplo al abrir/cerrar el modal)
    useEffect(() => {
        setArchivo(null);
        setPreview("");
        setImagenSubida(null);
        handleImgURL("");
        handleImgPublicId("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetKey]);

    useEffect(() => {
        if (!preview) return;
        return () => URL.revokeObjectURL(preview);
    }, [preview]);

    const handleFileChange = (e) => {
        const seleccionado = e.target.files?.[0];
        e.target.value = ""; // permite volver a elegir el mismo archivo
        if (!seleccionado) return;
        if (!seleccionado.type.startsWith("image/")) {
            toast.error("El archivo tiene que ser una imagen");
            return;
        }
        if (seleccionado.size > MAX_MB * 1024 * 1024) {
            toast.error(`La imagen no puede pesar más de ${MAX_MB} MB`);
            return;
        }
        setArchivo(seleccionado);
        setPreview(URL.createObjectURL(seleccionado));
    };

    const quitarSeleccion = () => {
        setArchivo(null);
        setPreview("");
        handleImgURL("");
        handleImgPublicId("");
    };

    const handleUpload = async () => {
        if (!archivo) return;
        setLoading(true);
        try {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
                reader.readAsDataURL(archivo);
            });
            const resultado = await subirImagenApi(base64);
            setImagenSubida(resultado);
            handleImgURL(resultado.secure_url);
            handleImgPublicId(resultado.public_id);
            toast.success("Imagen subida");
        } catch (e) {
            toast.error(mensajeDeError(e));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!imagenSubida?.public_id) return;
        setLoading(true);
        try {
            await borrarImagenApi(imagenSubida.public_id);
            setImagenSubida(null);
            quitarSeleccion();
        } catch (e) {
            toast.error(mensajeDeError(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Form.Label>Portada <span className="text-muted">(opcional)</span></Form.Label>

            <input id={inputId} type="file" accept="image/*" hidden
                onChange={handleFileChange} disabled={loading || Boolean(imagenSubida)} />

            {!imagenSubida && !archivo && (
                <div>
                    <Button as="label" htmlFor={inputId} variant="outline-secondary" size="sm">
                        Seleccionar imagen
                    </Button>
                </div>
            )}

            {preview && (
                <Image src={preview} alt="Vista previa" rounded className="d-block mb-2"
                    style={{ maxHeight: 160, objectFit: "cover" }} />
            )}

            {archivo && !imagenSubida && (
                <div className="d-flex gap-2">
                    <Button type="button" size="sm" onClick={handleUpload} disabled={loading}>
                        {loading ? "Subiendo..." : "Subir imagen"}
                    </Button>
                    <Button type="button" size="sm" variant="outline-secondary"
                        onClick={quitarSeleccion} disabled={loading}>
                        Quitar
                    </Button>
                </div>
            )}

            {imagenSubida && (
                <div className="d-flex align-items-center gap-2">
                    <span className="text-success small">✓ Imagen lista</span>
                    <Button type="button" size="sm" variant="outline-danger"
                        onClick={handleDelete} disabled={loading}>
                        {loading ? "Eliminando..." : "Quitar imagen"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SubirImagen;