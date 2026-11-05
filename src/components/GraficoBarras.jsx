import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import { Table } from "react-bootstrap";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const COLOR_BARRA = "#1f5a4f";
const COLOR_TEXTO = "#69736f";
const COLOR_LINEA = "#e6eae7";

// Escribe el valor al final de cada barra (etiqueta directa, sin saturar el gráfico)
const etiquetasDeValor = {
    id: "etiquetasDeValor",
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        ctx.save();
        ctx.font = "500 12px Inter, system-ui, sans-serif";
        ctx.fillStyle = "#1c2422";
        ctx.textBaseline = "middle";
        chart.getDatasetMeta(0).data.forEach((barra, i) => {
            ctx.fillText(String(chart.data.datasets[0].data[i]), barra.x + 8, barra.y);
        });
        ctx.restore();
    },
};

// datos: [{ etiqueta, valor }]  ·  unidad: "libro" | "usuario"
const GraficoBarras = ({ datos, unidad = "libro" }) => {
    const alto = Math.max(120, datos.length * 40 + 36);
    const maximo = Math.max(...datos.map((d) => d.valor), 1);

    const data = {
        labels: datos.map((d) => d.etiqueta),
        datasets: [
            {
                data: datos.map((d) => d.valor),
                backgroundColor: COLOR_BARRA,
                borderRadius: 4,
                borderSkipped: false,
                barThickness: 18,
            },
        ],
    };

    const options = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 28 } },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (c) => `${c.parsed.x} ${unidad}${c.parsed.x === 1 ? "" : "s"}`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                suggestedMax: maximo,
                ticks: { precision: 0, stepSize: 1, color: COLOR_TEXTO },
                grid: { color: COLOR_LINEA },
                border: { display: false },
            },
            y: {
                ticks: { color: "#1c2422" },
                grid: { display: false },
                border: { display: false },
            },
        },
    };

    return (
        <>
            <div style={{ height: alto }}>
                <Bar data={data} options={options} plugins={[etiquetasDeValor]} />
            </div>

            {/* Mismos datos en tabla, para quien no pueda leer el gráfico */}
            <details className="mt-3">
                <summary className="small text-muted">Ver datos en tabla</summary>
                <Table size="sm" className="mt-2 mb-0">
                    <tbody>
                        {datos.map((d) => (
                            <tr key={d.etiqueta}>
                                <td>{d.etiqueta}</td>
                                <td className="text-end">{d.valor}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </details>
        </>
    );
};

export default GraficoBarras;