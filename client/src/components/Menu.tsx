import { useMemo, useState } from "react";
import type { Ingrediente, Receta } from "../types";
import Filtros from "./Filtros";

interface MenuListProps {
  recetas: Receta[];
  ingredientes: Ingrediente[];
}

export default function MenuList({ recetas, ingredientes }: MenuListProps) {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

  const recetasFiltradas = useMemo(() => {
    if (categoriaActiva === "todos") {
      return recetas;
    }
    return recetas.filter(
      (receta) =>
        receta.categoria.toLowerCase() === categoriaActiva.toLowerCase()
    );
  }, [recetas, categoriaActiva]);

  const categoriasDisponibles = useMemo(() => {
    const cats = new Set(recetas.map((r) => r.categoria.toLowerCase()));
    return Array.from(cats).sort();
  }, [recetas]);

  return (
    <div className="px-2 sm:px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="text-sm text-gray-600 text-center">
          {recetasFiltradas.length} de {recetas.length} recetas
        </div>

        {categoriasDisponibles.length > 1 && (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl mx-auto px-4 min-w-0">
              <div
                className="min-w-0 w-full flex items-center justify-center
                           overflow-x-auto sm:overflow-visible -mx-2 py-1"
              >
                <div className="px-2 w-full flex justify-center min-w-0">
                  <Filtros
                    titulo="Filtrar"
                    categorias={categoriasDisponibles}
                    categoriaActiva={categoriaActiva}
                    onCambiarCategoria={setCategoriaActiva}
                    mostrarTodos={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {recetasFiltradas.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-md text-center text-gray-500">
          No hay recetas en esta categoría
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl -mt-2">
            {recetasFiltradas.map((receta) => (
              <article
                key={receta.id}
                className="bg-white rounded-2xl shadow-md border border-gray-50 p-5 flex flex-col h-full transition-transform hover:-translate-y-1"
                aria-label={`${receta.nombre} — ${receta.categoria}`}
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                      {receta.nombre}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                        {receta.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-amber-500 font-extrabold text-xl sm:text-2xl drop-shadow-sm">
                      ${receta.precio.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex-1">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Ingredientes
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    {receta.ingredientes.map((ri) => {
                      const ing = ingredientes.find(
                        (i) => i.id === ri.ingredienteId
                      );
                      return (
                        <div
                          key={ri.ingredienteId}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <span className="truncate">
                              {ing?.nombre ?? "Ingrediente"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {ri.cantidad} {ing?.unidad ?? ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
