import { Filter } from "lucide-react";

interface FiltrosProps {
  titulo: string;
  categorias: string[];
  categoriaActiva: string;
  onCambiarCategoria: (categoria: string) => void;
  mostrarTodos?: boolean;
}

export default function Filtros({
  titulo,
  categorias,
  categoriaActiva,
  onCambiarCategoria,
  mostrarTodos = true,
}: FiltrosProps) {
  const isActive = (c: string) => categoriaActiva === c;

  const totalBotones = categorias.length + (mostrarTodos ? 1 : 0);

  const ocultarScrollbar = totalBotones <= 4;

  return (
    <div className="w-full sm:w-auto bg-gradient-to-br from-white/90 to-gray-50 p-3 sm:p-4 rounded-2xl shadow-md border border-gray-100 min-w-0">
      {titulo && (
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 ring-1 ring-blue-100">
            <Filter size={18} className="text-orange-500" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{titulo}</h3>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 min-w-0">
        <div className={`flex items-center gap-2 overflow-x-auto min-w-0 ${ocultarScrollbar
          ? 'flex-wrap justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
          : 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'
          }`}>
          {mostrarTodos && (
            <button
              onClick={() => onCambiarCategoria("todos")}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 ${isActive("todos")
                ? "bg-blue-600 text-white transform scale-[1.01] shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Todos
            </button>
          )}

          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => onCambiarCategoria(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all text-sm capitalize shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 ${isActive(cat)
                ? "bg-blue-600 text-white transform scale-[1.01] shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
