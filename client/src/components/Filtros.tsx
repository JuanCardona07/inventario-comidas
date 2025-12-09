import { Filter, Search } from "lucide-react";
import { useState } from "react";

interface FiltrosProps {
  titulo: string;
  categorias: string[];
  categoriaActiva: string;
  onCambiarCategoria: (categoria: string) => void;
  onChangeQuery?: (query: string) => void;
  mostrarTodos?: boolean;
}

export default function Filtros({
  titulo,
  categorias,
  categoriaActiva,
  onCambiarCategoria,
  mostrarTodos = true,
  onChangeQuery,
}: FiltrosProps) {
  const [queryValue, setQueryValue] = useState("");
  const isActive = (c: string) => categoriaActiva === c;

  function onChangeQueryInput(value: string) {
    setQueryValue(value);
    if (typeof onChangeQuery === "function") onChangeQuery(value);
  }

  return (
    <div className="w-full max-w-2xl bg-gradient-to-br from-red-500 via-red-600 to-yellow-500 p-4 rounded-2xl shadow-lg border border-red-400">
      {titulo && (
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-yellow-300" />
          <h3 className="font-semibold text-white text-base">{titulo}</h3>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {mostrarTodos && (
            <button
              onClick={() => onCambiarCategoria("todos")}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${isActive("todos")
                ? "bg-white text-red-600 shadow-md"
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                }`}
            >
              Todos
            </button>
          )}
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => onCambiarCategoria(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm capitalize ${isActive(cat)
                ? "bg-white text-red-600 shadow-md"
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {typeof onChangeQuery === "function" && (
          <div className="w-full sm:w-60">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400"
              />
              <input
                value={queryValue}
                onChange={(e) => onChangeQueryInput(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-9 pr-3 py-2 border-2 border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white/90 text-gray-800 placeholder-gray-500"
                aria-label="Buscar ingrediente"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
