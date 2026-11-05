import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

const ESPERA_MS = 250;   // no aparece si la petición es rápida
const MINIMO_MS = 400;   // una vez que aparece, no parpadea

const LoaderGlobal = () => {
    const pendientes = useSelector((state) => state.cargaSlice.pendientes);
    const [visible, setVisible] = useState(false);
    const desde = useRef(0);

    useEffect(() => {
        if (pendientes > 0) {
            const t = setTimeout(() => {
                desde.current = Date.now();
                setVisible(true);
            }, ESPERA_MS);
            return () => clearTimeout(t);
        }
        const resto = desde.current ? Math.max(0, MINIMO_MS - (Date.now() - desde.current)) : 0;
        const t = setTimeout(() => {
            desde.current = 0;
            setVisible(false);
        }, resto);
        return () => clearTimeout(t);
    }, [pendientes]);

    if (!visible) return null;

    return (
        <div className="loader-global" role="status" aria-live="polite">
            <div className="loader-caja">
                <Spinner animation="border" size="sm" />
                <span>Cargando...</span>
            </div>
        </div>
    );
};

export default LoaderGlobal;