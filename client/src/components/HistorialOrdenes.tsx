import { Calendar, CalendarDays, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import type { Orden } from "../types";

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 2,
});

interface HistorialOrdenesProps {
  ordenes: Orden[];
}

export default function HistorialOrdenes({ ordenes }: HistorialOrdenesProps) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [diasExpandidos, setDiasExpandidos] = useState<Set<string>>(new Set());

  const toggleDia = (fecha: string) => {
    const nuevosExpandidos = new Set(diasExpandidos);
    if (nuevosExpandidos.has(fecha)) {
      nuevosExpandidos.delete(fecha);
    } else {
      nuevosExpandidos.add(fecha);
    }
    setDiasExpandidos(nuevosExpandidos);
  };

  const categoriasDisponibles = useMemo(() => {
    const cats = new Set(ordenes.map((o) => o.categoria).filter(Boolean));
    return Array.from(cats) as string[];
  }, [ordenes]);

  const ordenesFiltradas = useMemo(() => {
    let filtradas = [...ordenes];
    if (fechaInicio && fechaFin) {
      filtradas = filtradas.filter(
        (o) => o.fecha >= fechaInicio && o.fecha <= fechaFin
      );
    }
    if (categoriaActiva !== "todos") {
      filtradas = filtradas.filter((o) => o.categoria === categoriaActiva);
    }
    return filtradas;
  }, [ordenes, fechaInicio, fechaFin, categoriaActiva]);

  const totalVentas = useMemo(
    () => ordenesFiltradas.reduce((s, o) => s + o.total, 0),
    [ordenesFiltradas]
  );

  const ordenesPorFecha = useMemo(() => {
    const grupos: Record<string, Orden[]> = {};
    for (const o of ordenesFiltradas) {
      if (!grupos[o.fecha]) grupos[o.fecha] = [];
      grupos[o.fecha].push(o);
    }
    return grupos;
  }, [ordenesFiltradas]);

  const fechasOrdenadas = useMemo(
    () => Object.keys(ordenesPorFecha).sort().reverse(),
    [ordenesPorFecha]
  );

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-4">
      <div className="space-y-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>
            {ordenesFiltradas.length} de {ordenes.length} órdenes
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full bg-gradient-to-br from-slate-800 to-slate-700 p-4 rounded-xl shadow-lg border border-slate-600">
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Calendar className="text-blue-400 flex-shrink-0" size={18} />
                Filtrar por Fecha
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-xs text-slate-300 font-medium mb-2">Desde</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-slate-300 font-medium mb-2">Hasta</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-gradient-to-br from-slate-800 to-slate-700 p-4 rounded-xl shadow-lg border border-slate-600">
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Filter className="text-blue-400 flex-shrink-0" size={18} />
                Filtrar por Categoría
              </h2>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoriaActiva("todos")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-md transition flex-shrink-0 ${categoriaActiva === "todos"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                >
                  Todos
                </button>

                {categoriasDisponibles.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaActiva(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-md transition flex-shrink-0 ${categoriaActiva === cat
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {fechasOrdenadas.length === 0 ? (
          <div className="w-full bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl shadow-lg text-center text-slate-300 border border-slate-600">
            {ordenes.length === 0
              ? "No hay órdenes registradas aún"
              : "No hay órdenes que coincidan con los filtros"}
          </div>
        ) : (
          <div className="space-y-4">
            {fechasOrdenadas.map((fecha) => {
              const ordenesDelDia = ordenesPorFecha[fecha];
              const totalDia = ordenesDelDia.reduce((s, o) => s + o.total, 0);
              const fechaObj = new Date(fecha + "T00:00:00");
              const fechaTexto = fechaObj.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <section
                  key={fecha}
                  aria-labelledby={`dia-${fecha}`}
                  className="space-y-3"
                >
                  <header
                    onClick={() => toggleDia(fecha)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-lg flex-shrink-0 mt-1">
                        {diasExpandidos.has(fecha) ? '▼' : '▶'}
                      </span>
                      <div className="min-w-0">
                        <h3
                          id={`dia-${fecha}`}
                          className="font-bold text-base sm:text-lg capitalize flex items-center gap-2 break-words"
                        >
                          <CalendarDays size={18} className="flex-shrink-0" /> {fechaTexto}
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-200 mt-1">
                          {ordenesDelDia.length} orden
                          {ordenesDelDia.length !== 1 ? "es" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg sm:text-2xl font-bold">
                        {currency.format(totalDia)}
                      </p>
                      <p className="text-xs sm:text-sm text-blue-200 mt-1">
                        Total del día
                      </p>
                    </div>
                  </header>

                  {diasExpandidos.has(fecha) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {ordenesDelDia.map((orden) => (
                        <article
                          key={orden.id}
                          className="bg-gradient-to-br from-slate-800 to-slate-700 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col justify-between border border-slate-600 hover:-translate-y-1"
                          aria-label={`${orden.cantidad}x ${orden.recetaNombre} - ${orden.hora}`}
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-3 min-w-0">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-sm text-white break-words">
                                  {orden.cantidad}x {orden.recetaNombre}
                                </h4>
                              </div>
                              <p className="text-base sm:text-lg font-bold text-emerald-400 flex-shrink-0">
                                {currency.format(orden.total)}
                              </p>
                            </div>

                            {orden.categoria ? (
                              <span className="inline-block px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full capitalize shadow-md w-fit">
                                {orden.categoria}
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded-full w-fit">
                                Sin categoría
                              </span>
                            )}

                            <p className="text-xs text-slate-400">
                              🕐 {orden.hora}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

            <div className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-xl shadow-lg border border-emerald-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    💰 Total de ventas
                  </span>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                    {ordenesFiltradas.length} orden
                    {ordenesFiltradas.length !== 1 ? "es" : ""}
                    {fechaInicio &&
                      fechaFin &&
                      ` (${fechaInicio} al ${fechaFin})`}
                  </p>
                </div>
                <span className="text-2xl sm:text-3xl font-bold">
                  {currency.format(totalVentas)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
