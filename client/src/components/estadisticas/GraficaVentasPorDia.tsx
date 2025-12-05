import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Orden } from "../../types";

interface GraficaVentasPorDiaProps {
  ordenes: Orden[];
}

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function GraficaVentasPorDia({
  ordenes,
}: GraficaVentasPorDiaProps) {
  const datos = useMemo(() => {
    const ventasPorFecha: {
      [fecha: string]: { ventas: number; ordenes: number };
    } = {};

    ordenes.forEach((orden) => {
      if (!ventasPorFecha[orden.fecha]) {
        ventasPorFecha[orden.fecha] = { ventas: 0, ordenes: 0 };
      }
      ventasPorFecha[orden.fecha].ventas += orden.total;
      ventasPorFecha[orden.fecha].ordenes += 1;
    });

    return Object.entries(ventasPorFecha)
      .map(([fecha, data]) => ({
        fecha: new Date(fecha + "T00:00:00").toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
        }),
        fechaCompleta: fecha,
        ventas: data.ventas,
        ordenes: data.ordenes,
      }))
      .sort((a, b) => a.fechaCompleta.localeCompare(b.fechaCompleta));
  }, [ordenes]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.fecha}</p>
          <p className="text-green-600">
            Ventas: {currency.format(payload[0].payload.ventas)}
          </p>
          <p className="text-blue-600">Órdenes: {payload[0].payload.ordenes}</p>
        </div>
      );
    }
    return null;
  };

  if (datos.length === 1) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          📈 Ventas por Día
        </h3>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-600 mb-2">
            Solo tienes órdenes de un día ({datos[0].fecha})
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <p className="text-blue-900 font-semibold">
              {datos[0].ordenes} órdenes • {currency.format(datos[0].ventas)}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            💡 Crea órdenes en diferentes días para ver la gráfica de tendencia
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        📈 Ventas por Día
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="fecha" tick={{ fontSize: 12 }} stroke="#888" />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#888" />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke="#888"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="ventas"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", r: 6 }}
            activeDot={{ r: 8 }}
            name="Ventas ($)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="ordenes"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", r: 6 }}
            activeDot={{ r: 8 }}
            name="N° Órdenes"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
