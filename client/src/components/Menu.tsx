import { useMemo, useState } from "react";
import type { Ingrediente, Receta } from "../types";
import Filtros from "./Filtros";

interface MenuListProps {
  recetas: Receta[];
  ingredientes: Ingrediente[];
}

export default function MenuList({ recetas, ingredientes }: MenuListProps) {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const recetasFiltradas = useMemo(() => {
    let lista = recetas;

    if (categoriaActiva !== "todos") {
      lista = lista.filter((receta) =>
        (receta.categoria ?? "").toLowerCase() === categoriaActiva.toLowerCase()
      );
    }

    const q = busqueda.trim().toLowerCase();
    if (q !== "") {
      lista = lista.filter((receta) => {
        if ((receta.nombre ?? "").toLowerCase().includes(q)) return true;
        if (receta.ingredientes && receta.ingredientes.length > 0) {
          for (const ri of receta.ingredientes) {
            const ing = ingredientes.find((i) => i.id === ri.ingredienteId);
            if (ing && ing.nombre.toLowerCase().includes(q)) return true;
          }
        }
        return false;
      });
    }

    return lista;
  }, [recetas, categoriaActiva, busqueda, ingredientes]);

  const categoriasDisponibles = useMemo(() => {
    const cats = new Set(
      recetas
        .map((r) => (r.categoria ?? "").toString())
        .filter(Boolean)
        .map((c) => c.toLowerCase())
    );
    return Array.from(cats).sort();
  }, [recetas]);

  return (
    <div className="px-2 sm:px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="text-sm text-slate-300 text-center">
          {recetasFiltradas.length} de {recetas.length} recetas
        </div>

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
        <div className="bg-gradient-to-br from-red-50 to-yellow-50 p-8 rounded-2xl shadow-md text-center text-gray-600 border border-red-200">
          No hay recetas en esta categoría
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {recetasFiltradas.map((receta) => (
              <article
                key={receta.id}
                className="
                  rounded-2xl shadow-lg border border-slate-700
                  bg-gradient-to-br from-slate-800 to-slate-700
                  p-5 flex flex-col h-full
                  transition-all hover:-translate-y-1 hover:shadow-2xl
                "
                aria-label={`${receta.nombre} — ${receta.categoria}`}
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                      {receta.nombre}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="
                          inline-flex items-center px-3 py-1 rounded-full
                          text-xs font-medium
                          bg-gradient-to-r from-red-500 to-yellow-500 text-white capitalize shadow-md
                        "
                      >
                        {receta.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div
                      className="
                        text-transparent bg-clip-text
                        bg-gradient-to-r from-red-400 to-yellow-400
                        font-extrabold text-xl sm:text-2xl
                      "
                    >
                      ${receta.precio.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex-1">
                  <p className="text-sm font-semibold text-red-400 mb-2">
                    Ingredientes
                  </p>

                  <div className="space-y-2 text-sm text-slate-300">
                    {receta.ingredientes.map((ri) => {
                      const ing = ingredientes.find(
                        (i) => i.id === ri.ingredienteId
                      );

                      return (
                        <div
                          key={ri.ingredienteId}
                          className="flex items-center justify-between gap-4 pb-2 border-b border-slate-600/50"
                        >
                          <div className="min-w-0">
                            <span className="truncate text-white">
                              {ing?.nombre ?? "Ingrediente"}
                            </span>
                          </div>

                          <div className="text-xs text-slate-400 font-medium">
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
