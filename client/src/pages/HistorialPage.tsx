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

  return (
    <div>
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
          <button
            onClick={() => setVistaActiva('historial')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${vistaActiva === 'historial'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <History size={20} />
            Historial de Órdenes
          </button>
          <button
            onClick={() => setVistaActiva('estadisticas')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${vistaActiva === 'estadisticas'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <BarChart3 size={20} />
            Estadísticas y Reportes
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          {ordenes.length === 0 ? (
            'No hay órdenes registradas'
          ) : (
            <>
              📊 {ordenes.length} orden{ordenes.length !== 1 ? 'es' : ''} total
              {ordenes.length > 0 && (
                <span className="ml-2">
                  • Total: ${ordenes.reduce((s, o) => s + o.total, 0).toLocaleString('es-CO')}
                </span>
              )}
            </>
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
