import { useEffect, useMemo, useState } from "react";
import type { Ingrediente, Receta } from "../types";
import Filtros from "./Filtros";

interface NuevaOrdenProps {
  recetas: Receta[];
  ingredientes: Ingrediente[];
  onProcesarOrden: (recetaId: string, cantidad: number) => Promise<void> | void;
  processingOrder?: boolean;
}

export default function NuevaOrden({
  recetas,
  ingredientes,
  onProcesarOrden,
}: NuevaOrdenProps) {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [processingRecetaId, setProcessingRecetaId] = useState<string | null>(null);

  const recetasFiltradas = useMemo(() => {
    let lista = recetas;

    if (categoriaActiva !== "todos") {
      lista = lista.filter(
        (r) => (r.categoria ?? "").toLowerCase() === categoriaActiva.toLowerCase()
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

  const confirmarOrdenInline = async (recetaId: string, cantidad: number) => {
    setProcessingRecetaId(recetaId);
    try {
      await onProcesarOrden(recetaId, cantidad);
    } finally {
      setProcessingRecetaId(null);
      setCantidades((prev) => ({ ...prev, [recetaId]: 1 }));
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-8 gap-4">
        <span className="text-sm text-slate-300 font-medium text-center">
          {recetasFiltradas.length} de {recetas.length} recetas
        </span>

        {categoriasDisponibles.length > 1 && (
          <div className="w-full flex justify-center">
            <Filtros
              titulo="Filtrar"
              categorias={categoriasDisponibles}
              categoriaActiva={categoriaActiva}
              onCambiarCategoria={setCategoriaActiva}
              onChangeQuery={(q) => setBusqueda(q)}
              mostrarTodos={true}
            />
          </div>
        )}
      </div>

      {recetasFiltradas.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-2xl shadow-md text-center text-slate-300 border border-slate-600">
          No hay recetas disponibles
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recetasFiltradas.map((receta) => {
            const puedeHacer =
              receta.ingredientes?.every((ri) => {
                const ing = ingredientes.find((i) => i.id === ri.ingredienteId);
                return Boolean(ing && ing.cantidad >= ri.cantidad);
              }) ?? false;

            const maxDisponible = calcularMaxDisponible(receta);
            const cantidadActual = cantidades[receta.id] ?? 1;
            const cantidadClamped = Math.min(Math.max(1, cantidadActual), Math.max(1, maxDisponible));

            const isProcessing = processingRecetaId === receta.id;

            const cardBg = puedeHacer
              ? "bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600"
              : "bg-gradient-to-br from-slate-800 to-slate-700 border-red-500/50";

            return (
              <article
                key={receta.id}
                className={`rounded-2xl shadow-lg border p-5 flex flex-col justify-between transition-all ${cardBg} ${isProcessing ? "ring-2 ring-yellow-400 opacity-90" : "hover:-translate-y-1 hover:shadow-2xl"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-lg sm:text-xl font-semibold truncate ${puedeHacer ? "text-white" : "text-red-400"}`}>
                      {receta.nombre}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-full text-xs capitalize shadow-md font-medium">
                        {receta.categoria ?? "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isProcessing
                      ? "from-yellow-400 to-orange-400"
                      : puedeHacer
                        ? "from-yellow-500 to-orange-500"
                        : "from-red-500 to-red-600"
                      } flex items-center justify-center shadow-md transition-transform ${isProcessing ? 'animate-pulse' : ''
                      }`}>
                      <span className="text-2xl">🍽️</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-600 pt-4 text-sm">
                  <p className="font-semibold mb-2 text-yellow-400">Ingredientes</p>
                  <div className={`space-y-2 ${receta.ingredientes?.length > 8 ? 'max-h-64 overflow-y-auto pr-1' : ''}`}>
                    {receta.ingredientes?.length ? (
                      receta.ingredientes.map((ri) => {
                        const ing = ingredientes.find((i) => i.id === ri.ingredienteId);
                        const tieneStock = ing && ing.cantidad >= ri.cantidad;
                        return (
                          <div key={ri.ingredienteId} className={`flex justify-between text-sm pb-2 border-b border-slate-700/50 ${tieneStock ? "text-slate-300" : "text-red-400"
                            }`}>
                            <span className="truncate">{ing?.nombre ?? "Ingrediente desconocido"}</span>
                            <span className="ml-2 whitespace-nowrap text-slate-400">
                              {ri.cantidad} {ing?.unidad ?? ""}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-slate-400">Sin ingredientes listados</div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-600 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg bg-slate-700 shadow-md border border-slate-600 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => decrementar(receta.id)}
                        aria-label={`Disminuir cantidad de ${receta.nombre}`}
                        className="flex items-center justify-center px-3 py-2 text-sm text-slate-300 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        disabled={!puedeHacer || cantidadClamped <= 1 || isProcessing}
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
                        disabled={isProcessing}
                        className="w-16 text-center px-2 py-2 text-sm font-medium focus:outline-none disabled:opacity-50 bg-slate-700 text-white"
                      />

                      <button
                        type="button"
                        onClick={() => incrementar(receta.id, Math.max(1, maxDisponible))}
                        aria-label={`Incrementar cantidad de ${receta.nombre}`}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        disabled={!puedeHacer || cantidadClamped >= maxDisponible || isProcessing}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => confirmarOrdenInline(receta.id, cantidadClamped)}
                      disabled={!puedeHacer || cantidadClamped <= 0 || maxDisponible === 0 || isProcessing}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-md ${puedeHacer && maxDisponible > 0 && !isProcessing
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                        : "bg-slate-600 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </span>
                      ) : (
                        "Ordenar"
                      )}
                    </button>
                  </div>

                  {!puedeHacer && (
                    <p className="text-xs text-red-400 font-medium">⚠️ Sin stock</p>
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
