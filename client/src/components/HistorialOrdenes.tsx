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
    <div className="px-2 sm:px-4 md:px-6 max-w-7xl mx-auto">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4" />{" "}
            </span>
            <span>
              {ordenesFiltradas.length} de {ordenes.length} órdenes
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 bg-white p-3 shadow-sm relative" style={{
            clipPath: 'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))'
          }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="text-sky-600" size={16} />
                Filtrar por Fecha
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm"
                />
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white p-3 shadow-sm relative" style={{
            clipPath: 'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))'
          }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="text-sky-600" size={16} />
                Filtrar por Categoría
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoriaActiva("todos")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition ${categoriaActiva === "todos"
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Todos
              </button>

              {categoriasDisponibles.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition ${categoriaActiva === cat
                    ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {fechasOrdenadas.length === 0 ? (
          <div className="bg-white p-3 rounded-2xl shadow-md text-center text-gray-500">
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
                  className="space-y-2"
                >
                  <header
                    onClick={() => toggleDia(fecha)}
                    className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-3 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-md cursor-pointer hover:from-sky-700 hover:to-indigo-700 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {diasExpandidos.has(fecha) ? '▼' : '▶'}
                      </span>
                      <div>
                        <h3
                          id={`dia-${fecha}`}
                          className="font-bold text-sm sm:text-base capitalize"
                        >
                          <CalendarDays size={14} className="inline" /> {fechaTexto}
                        </h3>
                        <p className="text-xs sm:text-sm text-sky-100 mt-1">
                          {ordenesDelDia.length} orden
                          {ordenesDelDia.length !== 1 ? "es" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-xl font-bold">
                        {currency.format(totalDia)}
                      </p>
                      <p className="text-xs sm:text-sm text-sky-100 mt-1">
                        Total del día
                      </p>
                    </div>
                  </header>

                  {diasExpandidos.has(fecha) && (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {ordenesDelDia.map((orden) => (
                        <article
                          key={orden.id}
                          className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-150 flex flex-col justify-between border border-gray-50"
                          aria-label={`${orden.cantidad}x ${orden.recetaNombre} - ${orden.hora}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm sm:text-base truncate">
                                {orden.cantidad}x {orden.recetaNombre}
                              </h4>
                              {orden.categoria ? (
                                <span className="inline-block mt-2 px-2 py-0.5 bg-sky-50 text-sky-700 text-xs rounded-full capitalize">
                                  {orden.categoria}
                                </span>
                              ) : (
                                <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                                  Sin categoría
                                </span>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                🕐 {orden.hora}
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-right ml-2">
                              <p className="text-base sm:text-lg font-bold text-emerald-600 whitespace-nowrap">
                                {currency.format(orden.total)}
                              </p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-2xl mt-2 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="font-semibold text-sm sm:text-base">
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
                <span className="text-xl sm:text-2xl font-bold">
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
