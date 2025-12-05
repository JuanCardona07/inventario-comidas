import { useEffect, useMemo, useState } from "react";
import type { Ingrediente, Receta } from "../types";
import Filtros from "./Filtros";

interface NuevaOrdenProps {
  recetas: Receta[];
  ingredientes: Ingrediente[];
  onProcesarOrden: (recetaId: string, cantidad: number) => void;
}

export default function NuevaOrden({
  recetas,
  ingredientes,
  onProcesarOrden,
}: NuevaOrdenProps) {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  const recetasFiltradas = useMemo(() => {
    let lista = recetas;

    if (categoriaActiva !== "todos") {
      lista = lista.filter(
        (r) =>
          (r.categoria ?? "").toLowerCase() === categoriaActiva.toLowerCase()
      );
    }

    if (busqueda.trim() !== "") {
      const b = busqueda.toLowerCase();
      lista = lista.filter((r) => {
        if (r.nombre.toLowerCase().includes(b)) return true;
        if (r.ingredientes && r.ingredientes.length > 0) {
          for (const ri of r.ingredientes) {
            const ing = ingredientes.find((i) => i.id === ri.ingredienteId);
            if (ing && ing.nombre.toLowerCase().includes(b)) return true;
          }
        }
        return false;
      });
    }

    return lista;
  }, [recetas, categoriaActiva, busqueda, ingredientes]);

  const categoriasDisponibles = useMemo(() => {
    const cats = new Set(
      recetas.map((r) => (r.categoria ?? "").toLowerCase()).filter(Boolean)
    );
    return Array.from(cats).sort();
  }, [recetas]);

  const calcularMaxDisponible = (receta: Receta) => {
    if (!receta.ingredientes || receta.ingredientes.length === 0) return 99;
    let max = Infinity;
    for (const ri of receta.ingredientes) {
      const ing = ingredientes.find((i) => i.id === ri.ingredienteId);
      if (!ing) {
        max = 0;
        break;
      }
      const possible = Math.floor(ing.cantidad / ri.cantidad);
      max = Math.min(max, possible);
    }
    return Number.isFinite(max) ? Math.max(0, max) : 0;
  };

  useEffect(() => {
    setCantidades((prev) => {
      const next: Record<string, number> = { ...prev };
      recetas.forEach((r) => {
        const max = calcularMaxDisponible(r);
        const cur = prev[r.id] ?? 1;
        next[r.id] = Math.min(Math.max(1, cur), Math.max(1, max));
      });
      return next;
    });
  }, [recetas, ingredientes]);

  const incrementar = (recetaId: string, max: number) => {
    setCantidades((prev) => {
      const cur = prev[recetaId] ?? 1;
      const next = Math.min(max > 0 ? max : 1, cur + 1);
      return { ...prev, [recetaId]: next };
    });
  };

  const decrementar = (recetaId: string) => {
    setCantidades((prev) => {
      const cur = prev[recetaId] ?? 1;
      const next = Math.max(1, cur - 1);
      return { ...prev, [recetaId]: next };
    });
  };

  const onChangeCantidad = (recetaId: string, value: number, max: number) => {
    const clamped = Math.min(Math.max(1, Math.floor(value || 1)), Math.max(1, max));
    setCantidades((prev) => ({ ...prev, [recetaId]: clamped }));
  };

  const confirmarOrdenInline = (recetaId: string, cantidad: number) => {
    onProcesarOrden(recetaId, cantidad);
    setCantidades((prev) => ({ ...prev, [recetaId]: 1 }));
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-8 gap-3">
        <span className="text-sm text-gray-600 font-medium text-center">
          {recetasFiltradas.length} de {recetas.length} recetas
        </span>

        <input
          type="text"
          placeholder="Buscar receta..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-64 px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />

        {categoriasDisponibles.length > 1 && (
          <div className="w-full flex justify-center">
            <Filtros
              titulo="Filtrar"
              categorias={categoriasDisponibles}
              categoriaActiva={categoriaActiva}
              onCambiarCategoria={setCategoriaActiva}
            />
          </div>
        )}
      </div>

      {recetasFiltradas.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow-md text-center text-gray-500">
          No hay recetas disponibles
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 -mt-2">
          {recetasFiltradas.map((receta) => {
            const puedeHacer =
              receta.ingredientes?.every((ri) => {
                const ing = ingredientes.find((i) => i.id === ri.ingredienteId);
                return Boolean(ing && ing.cantidad >= ri.cantidad);
              }) ?? false;

            const maxDisponible = calcularMaxDisponible(receta);
            const cantidadActual = cantidades[receta.id] ?? 1;
            const cantidadClamped = Math.min(Math.max(1, cantidadActual), Math.max(1, maxDisponible));

            return (
              <article
                key={receta.id}
                className={`bg-white rounded-2xl shadow-md border border-gray-50 p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 ${!puedeHacer ? "opacity-90" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold truncate text-gray-900">
                      {receta.nombre}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs capitalize">
                        {receta.categoria ?? "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center ring-1 ring-sky-100">
                      <span className="text-2xl">🍽️</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4 text-sm text-gray-600">
                  <p className="font-medium mb-2">Ingredientes</p>
                  <div className="space-y-2 max-h-44 overflow-auto pr-1">
                    {receta.ingredientes?.length ? (
                      receta.ingredientes.map((ri) => {
                        const ing = ingredientes.find((i) => i.id === ri.ingredienteId);
                        return (
                          <div key={ri.ingredienteId} className="flex justify-between text-sm text-gray-700">
                            <span className="truncate">{ing?.nombre ?? "Ingrediente desconocido"}</span>
                            <span className="ml-2 whitespace-nowrap text-gray-500">
                              {ri.cantidad} {ing?.unidad ?? ""}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-gray-500">Sin ingredientes listados</div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full bg-white shadow-sm border border-gray-100 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => decrementar(receta.id)}
                        aria-label={`Disminuir cantidad de ${receta.nombre}`}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-white hover:bg-gray-100 disabled:opacity-40"
                        disabled={!puedeHacer || cantidadClamped <= 1}
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={Math.max(1, maxDisponible)}
                        value={cantidadClamped}
                        onChange={(e) => onChangeCantidad(receta.id, Number(e.target.value), maxDisponible)}
                        aria-label={`Cantidad para ${receta.nombre}`}
                        className="w-16 text-center px-2 py-2 text-sm font-medium focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => incrementar(receta.id, Math.max(1, maxDisponible))}
                        aria-label={`Incrementar cantidad de ${receta.nombre}`}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-gradient-to-br from-sky-600 to-indigo-600 text-white hover:brightness-95 disabled:opacity-40"
                        disabled={!puedeHacer || cantidadClamped >= maxDisponible}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => confirmarOrdenInline(receta.id, cantidadClamped)}
                      disabled={!puedeHacer || cantidadClamped <= 0 || maxDisponible === 0}
                      className={`ml-18 px-3 py-2 rounded-md text-sm font-medium transition ${puedeHacer && maxDisponible > 0 ? "bg-gradient-to-br from-sky-600 to-indigo-600 text-white hover:brightness-95" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                    >
                      Ordenar
                    </button>
                  </div>

                  {!puedeHacer && (
                    <p className="text-xs text-red-600 font-medium">⚠️ Sin stock</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

    </div>
  );
}
