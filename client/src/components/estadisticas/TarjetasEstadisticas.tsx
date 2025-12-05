import { AlertTriangle, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import type { Ingrediente, Orden } from '../../types';

interface TarjetasEstadisticasProps {
  ordenes: Orden[];
  ingredientesBajos: Ingrediente[];
}

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function TarjetasEstadisticas({ ordenes, ingredientesBajos }: TarjetasEstadisticasProps) {
  const estadisticas = useMemo(() => {
    const totalVentas = ordenes.reduce((sum, o) => sum + o.total, 0);
    const totalProductos = ordenes.reduce((sum, o) => sum + o.cantidad, 0);
    const promedioVenta = ordenes.length > 0 ? totalVentas / ordenes.length : 0;

    return {
      totalVentas,
      totalProductos,
      totalOrdenes: ordenes.length,
      promedioVenta,
    };
  }, [ordenes]);

  const tarjetas = [
    {
      titulo: 'Ventas Totales',
      valor: currency.format(estadisticas.totalVentas),
      icono: DollarSign,
      color: 'bg-green-500',
      colorClaro: 'bg-green-50',
      colorTexto: 'text-green-700',
    },
    {
      titulo: 'Total de Órdenes',
      valor: estadisticas.totalOrdenes.toString(),
      icono: ShoppingCart,
      color: 'bg-blue-500',
      colorClaro: 'bg-blue-50',
      colorTexto: 'text-blue-700',
    },
    {
      titulo: 'Productos Vendidos',
      valor: estadisticas.totalProductos.toString(),
      icono: TrendingUp,
      color: 'bg-purple-500',
      colorClaro: 'bg-purple-50',
      colorTexto: 'text-purple-700',
    },
    {
      titulo: 'Promedio por Orden',
      valor: currency.format(estadisticas.promedioVenta),
      icono: DollarSign,
      color: 'bg-orange-500',
      colorClaro: 'bg-orange-50',
      colorTexto: 'text-orange-700',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tarjetas.map((tarjeta) => {
          const Icono = tarjeta.icono;
          return (
            <div
              key={tarjeta.titulo}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{tarjeta.titulo}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{tarjeta.valor}</p>
                </div>
                <div className={`${tarjeta.colorClaro} p-3 rounded-full`}>
                  <Icono className={`w-6 h-6 ${tarjeta.colorTexto}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {ingredientesBajos.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">
                ⚠️ Ingredientes con stock bajo ({ingredientesBajos.length})
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {ingredientesBajos.map((ing) => (
                  <span key={ing.id} className="inline-block mr-3 mb-1">
                    • {ing.nombre}: {ing.cantidad} {ing.unidad}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
