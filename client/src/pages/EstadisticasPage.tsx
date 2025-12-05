import { useEffect, useMemo, useState } from 'react';
import FiltroFecha from '../components/FiltroFecha';
import Loading from '../components/Loading';
import GraficaProductosMasVendidos from '../components/estadisticas/GraficaProductosMasVendidos';
import GraficaVentasPorCategoria from '../components/estadisticas/GraficaVentasPorCategoria';
import GraficaVentasPorDia from '../components/estadisticas/GraficaVentasPorDia';
import TarjetasEstadisticas from '../components/estadisticas/TarjetasEstadisticas';
import { useAppContext } from '../context/AppContext';

export default function EstadisticasPage() {
  const {
    ordenes,
    ingredientes,
    ordenesCargadas,
    ingredientesCargados,
    loading,
    refrescarOrdenes,
    refrescarIngredientes
  } = useAppContext();

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    if (!ordenesCargadas) {
      refrescarOrdenes();
    }
    if (!ingredientesCargados) {
      refrescarIngredientes();
    }
  }, [ordenesCargadas, ingredientesCargados, refrescarOrdenes, refrescarIngredientes]);

  const ordenesFiltradas = useMemo(() => {
    if (!fechaInicio || !fechaFin) return ordenes;
    return ordenes.filter((o) => o.fecha >= fechaInicio && o.fecha <= fechaFin);
  }, [ordenes, fechaInicio, fechaFin]);

  const ingredientesBajos = useMemo(() => {
    return ingredientes.filter((ing) => ing.cantidad <= ing.minimo);
  }, [ingredientes]);

  if (loading && (!ordenesCargadas || !ingredientesCargados)) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900'>📊 Estadísticas y Reportes</h2>
          <p className='text-gray-600 mt-1'>Análisis de ventas y desempeño del negocio</p>
        </div>
      </div>

      <FiltroFecha
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onCambiarFechaInicio={setFechaInicio}
        onCambiarFechaFin={setFechaFin}
      />

      {ordenesFiltradas.length === 0 ? (
        <div className='bg-white p-8 rounded-lg shadow-md text-center text-gray-500'>
          {ordenes.length === 0
            ? 'No hay órdenes para mostrar estadísticas'
            : 'No hay órdenes en el rango de fechas seleccionado'}
        </div>
      ) : (
        <>
          <TarjetasEstadisticas
            ordenes={ordenesFiltradas}
            ingredientesBajos={ingredientesBajos}
          />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <GraficaVentasPorDia ordenes={ordenesFiltradas} />
            <GraficaVentasPorCategoria ordenes={ordenesFiltradas} />
          </div>

          <GraficaProductosMasVendidos ordenes={ordenesFiltradas} />
        </>
      )}
    </div>
  );
}
