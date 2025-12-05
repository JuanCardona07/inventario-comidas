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
  "#3b82f6",
  "#10b981",
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
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.nombre}</p>
          <p className="text-blue-600">
            Cantidad: {payload[0].payload.cantidad} unidades
          </p>
          <p className="text-green-600">
            Ventas: {currency.format(payload[0].payload.ventas)}
          </p>
          <p className="text-gray-600 text-sm capitalize">
            {payload[0].payload.categoria}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        🏆 Productos Más Vendidos
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={datos}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="nombre"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
            stroke="#888"
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            stroke="#888"
            label={{ value: "Cantidad", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke="#888"
            label={{ value: "Ventas ($)", angle: 90, position: "insideRight" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
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
            opacity={0.7}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
