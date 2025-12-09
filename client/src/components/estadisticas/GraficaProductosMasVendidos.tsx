import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Orden } from "../../types";

interface GraficaProductosMasVendidosProps {
  ordenes: Orden[];
}

const COLORES = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function GraficaProductosMasVendidos({
  ordenes,
}: GraficaProductosMasVendidosProps) {
  const datos = useMemo(() => {
    const productos: {
      [nombre: string]: {
        cantidad: number;
        ventas: number;
        categoria: string;
      };
    } = {};

    ordenes.forEach((orden) => {
      if (!productos[orden.recetaNombre]) {
        productos[orden.recetaNombre] = {
          cantidad: 0,
          ventas: 0,
          categoria: orden.categoria || "Sin categoría",
        };
      }
      productos[orden.recetaNombre].cantidad += orden.cantidad;
      productos[orden.recetaNombre].ventas += orden.total;
    });

    return Object.entries(productos)
      .map(([nombre, data]) => ({
        nombre,
        cantidad: data.cantidad,
        ventas: data.ventas,
        categoria: data.categoria,
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 8);
  }, [ordenes]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-4 border border-slate-600 rounded-lg shadow-xl">
          <p className="font-semibold text-white mb-2">{payload[0].payload.nombre}</p>
          <p className="text-blue-400 text-sm">
            Cantidad: <span className="font-bold">{payload[0].payload.cantidad}</span> unidades
          </p>
          <p className="text-emerald-400 text-sm">
            Ventas: <span className="font-bold">{currency.format(payload[0].payload.ventas)}</span>
          </p>
          <p className="text-slate-300 text-xs mt-1 capitalize">
            {payload[0].payload.categoria}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl shadow-lg border border-slate-600">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        Productos Más Vendidos
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={datos}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
          <XAxis
            dataKey="nombre"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12, fill: "#cbd5e1" }}
            stroke="#64748b"
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: "#cbd5e1" }}
            stroke="#64748b"
            label={{
              value: "Cantidad",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#cbd5e1" }
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: "#cbd5e1" }}
            stroke="#64748b"
            label={{
              value: "Ventas ($)",
              angle: 90,
              position: "insideRight",
              style: { fill: "#cbd5e1" }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              color: "#cbd5e1"
            }}
            iconType="circle"
          />
          <Bar
            yAxisId="left"
            dataKey="cantidad"
            name="Cantidad Vendida"
            radius={[8, 8, 0, 0]}
          >
            {datos.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORES[index % COLORES.length]}
              />
            ))}
          </Bar>
          <Bar
            yAxisId="right"
            dataKey="ventas"
            name="Ventas ($)"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
