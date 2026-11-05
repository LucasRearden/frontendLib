import { useEffect, useId, useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { borrarImagenApi, subirImagenApi } from "../services/imagenesServices";
import { mensajeDeError } from "../utils/errores";

const MAX_MB = 4.3; // Vercel limita el body a ~4.5MB y el base64 pesa ~33% más

const SubirImagen = ({ handleImgURL, handleImgPublicId, resetKey, onPendingChange, titulo, ayuda }) => {
    const [archivo, setArchivo] = useState(null);
    const [preview, setPreview] = useState("");
    const [imagenSubida, setImagenSubida] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputId = useId();

    // Hay una imagen elegida que todavía no se subió
    const pendiente = Boolean(archivo && !imagenSubida);

    // Le avisa al formulario para que no deje agregar el libro con una subida a medias
    useEffect(() => {
        onPendingChange?.(pendiente);
        return () => onPendingChange?.(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendiente]);

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

    const estado = imagenSubida ? "lista" : archivo ? "pendiente" : "";

    return (
        <div>
           <Form.Label>{titulo ?? <>Portada <span className="text-muted fw-normal">(opcional)</span></>}</Form.Label>

            <div className={`zona-imagen ${estado}`}>
                <input id={inputId} type="file" accept="image/*" hidden onChange={handleFileChange}
                    disabled={loading || Boolean(archivo)} />

                {/* 1. Sin imagen: explica cómo funciona */}
                {!archivo && (
                    <>
                        <ol className="pasos">
                            <li>Elegí una imagen de tu equipo.</li>
                            <li>Tocá <strong>Subir imagen</strong> para guardarla.</li>
                        </ol>
                        <Button as="label" htmlFor={inputId} variant="outline-secondary" size="sm">
                            Elegir imagen
                        </Button>
                       <div className="text-muted small mt-2">{ayuda ?? "Si no querés portada, dejalo así y agregá el libro."}</div>
                    </>
                )}

                {/* 2. Elegida pero sin subir */}
                {pendiente && (
                    <div className="d-flex gap-3 align-items-start">
                        <Image src={preview} alt="Vista previa" rounded style={{ width: 84, aspectRatio: "3 / 4", objectFit: "contain", background: "#e9ece8" }} />
                        <div>
                            <div className="small mb-2"><strong>Falta un paso:</strong> la imagen todavía no está subida.</div>
                            <div className="d-flex gap-2">
                                <Button type="button" size="sm" onClick={handleUpload} disabled={loading}>
                                    {loading ? "Subiendo..." : "Subir imagen"}
                                </Button>
                                <Button type="button" size="sm" variant="outline-secondary" onClick={quitarSeleccion} disabled={loading}>
                                    Quitar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Subida */}
                {imagenSubida && (
                    <div className="d-flex gap-3 align-items-center">
                        <Image src={preview} alt="Portada subida" rounded style={{ width: 84, aspectRatio: "3 / 4", objectFit: "contain", background: "#e9ece8" }} />
                        <div>
                            <div className="small mb-2"><strong>Portada lista.</strong> Se va a guardar con el libro.</div>
                            <Button type="button" size="sm" variant="outline-secondary" onClick={handleDelete} disabled={loading}>
                                {loading ? "Quitando..." : "Quitar portada"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubirImagen;