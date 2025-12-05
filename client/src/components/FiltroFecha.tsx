import { Calendar } from 'lucide-react';

interface FiltroFechaProps {
  fechaInicio: string;
  fechaFin: string;
  onCambiarFechaInicio: (fecha: string) => void;
  onCambiarFechaFin: (fecha: string) => void;
}

export default function FiltroFecha({
  fechaInicio,
  fechaFin,
  onCambiarFechaInicio,
  onCambiarFechaFin,
}: FiltroFechaProps) {
  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-gradient-to-br from-white/80 to-gray-50 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 ring-1 ring-blue-100">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
              Filtrar por Fecha
            </h3>
            <p className="text-xs text-gray-500 -mt-0.5">Filtra ventas por rango de fecha</p>
          </div>
        </div>
      </div>

      <form className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="w-full">
          <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-600 mb-1">
            Fecha Inicio
          </label>
          <input
            id="fechaInicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => onCambiarFechaInicio(e.target.value)}
            max={hoy}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            aria-label="Fecha de inicio"
          />
        </div>

        <div className="w-full">
          <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-600 mb-1">
            Fecha Fin
          </label>
          <input
            id="fechaFin"
            type="date"
            value={fechaFin}
            onChange={(e) => onCambiarFechaFin(e.target.value)}
            max={hoy}
            min={fechaInicio || undefined}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            aria-label="Fecha de fin"
          />
        </div>
      </form>

      {fechaInicio && fechaFin && (
        <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
          <span className="text-sm">📅</span>
          <span>
            Mostrando desde <strong className="text-gray-800">{fechaInicio}</strong> hasta{' '}
            <strong className="text-gray-800">{fechaFin}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
