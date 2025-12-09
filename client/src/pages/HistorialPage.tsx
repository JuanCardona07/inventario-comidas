import { BarChart3, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import EstadisticasVentas from '../components/EstadisticasVentas';
import HistorialOrdenes from '../components/HistorialOrdenes';
import Loading from '../components/Loading';
import { useAppContext } from '../context/AppContext';

export default function HistorialPage() {
  const [vistaActiva, setVistaActiva] = useState<'historial' | 'estadisticas'>('historial');
  const {
    ordenes,
    ordenesCargadas,
    loading,
    refrescarOrdenes
  } = useAppContext();

  useEffect(() => {
    if (!ordenesCargadas) {
      refrescarOrdenes();
    }
  }, [ordenesCargadas, refrescarOrdenes]);

  if (loading && !ordenesCargadas) {
    return <Loading />;
  }

  const totalVentas = ordenes.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-1.5 inline-flex border border-slate-600">
          <button
            onClick={() => setVistaActiva('historial')}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${vistaActiva === 'historial'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
          >
            <History size={20} />
            <span className="hidden sm:inline">Historial de Órdenes</span>
            <span className="sm:hidden">Historial</span>
          </button>
          <button
            onClick={() => setVistaActiva('estadisticas')}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${vistaActiva === 'estadisticas'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
          >
            <BarChart3 size={20} />
            <span className="hidden sm:inline">Estadísticas y Reportes</span>
            <span className="sm:hidden">Estadísticas</span>
          </button>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 shadow-lg border border-slate-600">
          {ordenes.length === 0 ? (
            <p className="text-slate-300 text-sm flex items-center gap-2">
              <span className="text-lg">📋</span>
              No hay órdenes registradas
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-slate-300 text-sm">Total de órdenes</p>
                  <p className="text-white text-lg font-bold">
                    {ordenes.length} orden{ordenes.length !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-600 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-slate-300 text-sm">Total de ventas</p>
                  <p className="text-emerald-400 text-lg font-bold">
                    ${totalVentas.toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {vistaActiva === 'historial' ? (
        <HistorialOrdenes ordenes={ordenes} />
      ) : (
        <EstadisticasVentas ordenes={ordenes} />
      )}
    </div>
  );
}
