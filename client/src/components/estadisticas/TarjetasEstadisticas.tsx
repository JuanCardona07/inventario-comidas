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
      colorIcono: 'text-emerald-400',
      colorValor: 'text-emerald-400',
    },
    {
      titulo: 'Total de Órdenes',
      valor: estadisticas.totalOrdenes.toString(),
      icono: ShoppingCart,
      colorIcono: 'text-blue-400',
      colorValor: 'text-blue-400',
    },
    {
      titulo: 'Productos Vendidos',
      valor: estadisticas.totalProductos.toString(),
      icono: TrendingUp,
      colorIcono: 'text-purple-400',
      colorValor: 'text-purple-400',
    },
    {
      titulo: 'Promedio por Orden',
      valor: currency.format(estadisticas.promedioVenta),
      icono: DollarSign,
      colorIcono: 'text-orange-400',
      colorValor: 'text-orange-400',
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
              className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-6 border border-slate-600 hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-300 font-medium mb-2">{tarjeta.titulo}</p>
                  <p className={`text-2xl font-bold ${tarjeta.colorValor}`}>{tarjeta.valor}</p>
                </div>
                <div className="bg-slate-700 p-3 rounded-lg border border-slate-600">
                  <Icono className={`w-6 h-6 ${tarjeta.colorIcono}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {ingredientesBajos.length > 0 && (
        <div className="bg-gradient-to-br from-red-900/40 to-red-800/40 border border-red-700 p-6 rounded-xl shadow-lg">
          <div className="flex items-start">
            <div className="bg-red-800 p-3 rounded-lg border border-red-700 mr-4 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                <span className="text-xl">⚠️</span>
                Ingredientes con stock bajo ({ingredientesBajos.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ingredientesBajos.map((ing) => (
                  <div key={ing.id} className="bg-red-800/30 p-3 rounded-lg border border-red-700/50">
                    <p className="text-sm text-red-200">
                      <span className="font-semibold text-white">{ing.nombre}</span>
                      <br />
                      <span className="text-red-300">{ing.cantidad} {ing.unidad}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
