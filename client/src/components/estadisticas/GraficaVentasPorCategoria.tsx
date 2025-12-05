import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Orden } from '../../types';

interface GraficaVentasPorCategoriaProps {
  ordenes: Orden[];
}

const COLORES = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function GraficaVentasPorCategoria({ ordenes }: GraficaVentasPorCategoriaProps) {
  const datos = useMemo(() => {
    const ventasPorCategoria: { [cat: string]: number } = {};

    ordenes.forEach((orden) => {
      const cat = orden.categoria || 'Sin categoría';
      ventasPorCategoria[cat] = (ventasPorCategoria[cat] || 0) + orden.total;
    });

    return Object.entries(ventasPorCategoria)
      .map(([categoria, ventas]) => ({
        categoria: categoria.charAt(0).toUpperCase() + categoria.slice(1),
        ventas,
      }))
      .sort((a, b) => b.ventas - a.ventas);
  }, [ordenes]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const porcentaje = ((payload[0].value / ordenes.reduce((s, o) => s + o.total, 0)) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.categoria}</p>
          <p className="text-green-600">{currency.format(payload[0].value)}</p>
          <p className="text-gray-600 text-sm">{porcentaje}% del total</p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    const porcentaje = ((entry.value / ordenes.reduce((s, o) => s + o.total, 0)) * 100).toFixed(0);
    return `${porcentaje}%`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-900 mb-4">🥧 Ventas por Categoría</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={datos}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="ventas"
          >
            {datos.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => `${entry.payload.categoria}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
