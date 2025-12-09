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
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl shadow-lg border border-slate-600">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-700 border border-slate-600">
            <Calendar size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base sm:text-lg">
              Filtrar por Fecha
            </h3>
            <p className="text-xs text-slate-400 -mt-0.5">Filtra ventas por rango de fecha</p>
          </div>
        </div>
      </div>

      <form className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="w-full">
          <label htmlFor="fechaInicio" className="block text-sm font-medium text-slate-300 mb-2">
            Fecha Inicio
          </label>
          <input
            id="fechaInicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => onCambiarFechaInicio(e.target.value)}
            max={hoy}
            className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            aria-label="Fecha de inicio"
          />
        </div>

        <div className="w-full">
          <label htmlFor="fechaFin" className="block text-sm font-medium text-slate-300 mb-2">
            Fecha Fin
          </label>
          <input
            id="fechaFin"
            type="date"
            value={fechaFin}
            onChange={(e) => onCambiarFechaFin(e.target.value)}
            max={hoy}
            min={fechaInicio || undefined}
            className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            aria-label="Fecha de fin"
          />
        </div>
      </form>

      {fechaInicio && fechaFin && (
        <div className="mt-4 text-sm text-slate-300 flex items-center gap-2 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
          <span className="text-base">📅</span>
          <span>
            Mostrando desde <strong className="text-white">{fechaInicio}</strong> hasta{' '}
            <strong className="text-white">{fechaFin}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
