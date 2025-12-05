import { FileSpreadsheet, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Orden } from '../types';
import { calcularTotales } from '../utils/calculations';
import { exportarExcel } from '../utils/exportExcel';
import { exportarPDF } from '../utils/exportPDF';
import FiltroFecha from './FiltroFecha';
import GraficaProductosMasVendidos from './estadisticas/GraficaProductosMasVendidos';
import GraficaVentasPorCategoria from './estadisticas/GraficaVentasPorCategoria';
import GraficaVentasPorDia from './estadisticas/GraficaVentasPorDia';
import TarjetasEstadisticas from './estadisticas/TarjetasEstadisticas';

interface EstadisticasVentasProps {
  ordenes: Orden[];
}

export default function EstadisticasVentas({ ordenes }: EstadisticasVentasProps) {
  const { ingredientes } = useAppContext();
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [exportando, setExportando] = useState(false);

  const ordenesFiltradas = useMemo(() => {
    if (!fechaInicio || !fechaFin) return ordenes;
    return ordenes.filter((o) => o.fecha >= fechaInicio && o.fecha <= fechaFin);
  }, [ordenes, fechaInicio, fechaFin]);

  const totales = useMemo(
    () => calcularTotales(ordenesFiltradas),
    [ordenesFiltradas]
  );

  const ingredientesBajos = useMemo(() => {
    return ingredientes.filter((ing) => ing.cantidad <= ing.minimo);
  }, [ingredientes]);

  const handleExportarExcel = () => {
    setExportando(true);
    try {
      exportarExcel(ordenesFiltradas, fechaInicio, fechaFin);
    } finally {
      setExportando(false);
    }
  };

  const handleExportarPDF = () => {
    setExportando(true);
    try {
      exportarPDF(ordenesFiltradas, fechaInicio, fechaFin);
    } finally {
      setExportando(false);
    }
  };

  if (ordenes.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No hay datos para mostrar</h3>
        <p className="text-gray-500">
          Crea algunas órdenes primero para ver las estadísticas y gráficas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportarExcel}
            disabled={exportando || ordenesFiltradas.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={18} />
            Exportar Excel
          </button>

          <button
            onClick={handleExportarPDF}
            disabled={exportando || ordenesFiltradas.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={18} />
            Exportar PDF
          </button>
        </div>
      </div>

      <FiltroFecha
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onCambiarFechaInicio={setFechaInicio}
        onCambiarFechaFin={setFechaFin}
      />

      {ordenesFiltradas.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
          No hay órdenes en el rango de fechas seleccionado
        </div>
      ) : (
        <>
          <TarjetasEstadisticas
            ordenes={ordenesFiltradas}
            ingredientesBajos={ingredientesBajos}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GraficaVentasPorDia ordenes={ordenesFiltradas} />
            <GraficaVentasPorCategoria ordenes={ordenesFiltradas} />
          </div>

          <GraficaProductosMasVendidos ordenes={ordenesFiltradas} />
        </>
      )}
    </div>
  );
}
