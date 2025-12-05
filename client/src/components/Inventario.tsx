import { AlertTriangle, PackagePlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Ingrediente } from '../types';
import Filtros from './Filtros';
import ModalReabastecer from './ModalReabastecer';

interface InventarioListProps {
  ingredientes: Ingrediente[];
  onReabastecer: (ingredienteId: string, cantidad: number) => void;
}

const CATEGORIAS_INGREDIENTES = ['Carnes', 'Verduras', 'Panes', 'Salsas', 'Lácteos', 'Otros'];

export default function InventarioList({ ingredientes, onReabastecer }: InventarioListProps) {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<Ingrediente | null>(null);

  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const abrirModal = (ingrediente: Ingrediente) => {
    setIngredienteSeleccionado(ingrediente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setIngredienteSeleccionado(null);
  };

  const confirmarReabastecimiento = (ingredienteId: string, cantidad: number) => {
    onReabastecer(ingredienteId, cantidad);
    cerrarModal();
  };

  const porCategoria = useMemo(() => {
    if (categoriaActiva === 'todos') return ingredientes;
    return ingredientes.filter((ing) => ing.categoria?.toLowerCase() === categoriaActiva.toLowerCase());
  }, [ingredientes, categoriaActiva]);

  const porBusqueda = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return porCategoria;
    return porCategoria.filter((ing) => ing.nombre.toLowerCase().includes(q));
  }, [porCategoria, query]);

  const ingredientesBajos = useMemo(() => ingredientes.filter((ing) => ing.cantidad <= ing.minimo).length, [ingredientes]);

  const totalPages = Math.max(1, Math.ceil(porBusqueda.length / pageSize));
  const currentPageClamped = Math.min(Math.max(1, currentPage), totalPages);

  const visibleIngredientes = useMemo(() => {
    const start = (currentPageClamped - 1) * pageSize;
    return porBusqueda.slice(start, start + pageSize);
  }, [porBusqueda, currentPageClamped]);

  const onQueryOrFilterChange = (newQuery?: string, newCategoria?: string) => {
    if (typeof newQuery === 'string') setQuery(newQuery);
    if (typeof newCategoria === 'string') setCategoriaActiva(newCategoria);
    setCurrentPage(1);
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="text-sm text-gray-600 text-center">
          {porBusqueda.length} de {ingredientes.length} ingredientes
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl mx-auto px-4 min-w-0">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="min-w-0 flex-1">
                <input
                  value={query}
                  onChange={(e) => onQueryOrFilterChange(e.target.value, undefined)}
                  placeholder="Buscar ingrediente..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label="Buscar ingrediente"
                />
              </div>

              <div className="min-w-0 w-full sm:w-auto">
                <Filtros
                  titulo="Categoría"
                  categorias={CATEGORIAS_INGREDIENTES}
                  categoriaActiva={categoriaActiva}
                  onCambiarCategoria={(c) => onQueryOrFilterChange(undefined, c)}
                  mostrarTodos={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        {ingredientesBajos > 0 && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-2 justify-center">
            <AlertTriangle size={16} />
            {ingredientesBajos} ingrediente{ingredientesBajos !== 1 ? 's' : ''} con stock bajo
          </p>
        )}
      </div>

      <div className="space-y-3 md:hidden">
        {visibleIngredientes.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            No hay ingredientes que coincidan
          </div>
        ) : (
          visibleIngredientes.map((ing) => {
            const low = ing.cantidad <= ing.minimo;
            return (
              <div key={ing.id} className={`bg-white p-3 rounded-lg shadow-sm border ${low ? 'border-red-100 bg-red-50' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{ing.nombre}</div>
                    <div className="text-xs text-gray-500 mt-1">{ing.categoria ?? '—'}</div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-semibold ${low ? 'text-red-600' : 'text-gray-900'}`}>{ing.cantidad}</div>
                    <div className="text-xs text-gray-500">{ing.unidad ?? '—'}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="text-sm text-gray-600">Mínimo: <span className={`font-medium ${low ? 'text-red-600' : 'text-gray-700'}`}>{ing.minimo}</span></div>
                  <button
                    onClick={() => abrirModal(ing)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${low ? 'bg-red-600 text-white' : 'bg-green-50 text-green-700'}`}
                    aria-label={`Reabastecer ${ing.nombre}`}
                  >
                    <PackagePlus size={16} />
                    Reabastecer
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="hidden md:block">
        {porBusqueda.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
            No hay ingredientes que coincidan
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-[720px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Categoría</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Unidad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Mínimo</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visibleIngredientes.map((ing) => {
                  const low = ing.cantidad <= ing.minimo;
                  return (
                    <tr key={ing.id} className={low ? 'bg-red-50' : ''}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[260px]">{ing.nombre}</div>
                        <div className="text-xs text-gray-500 mt-1 hidden lg:block">{ing.categoria}</div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                        <div className={`text-sm ${low ? 'text-red-600 font-medium' : 'text-gray-700'}`}>{ing.categoria ?? '—'}</div>
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-right">
                        <div className={`text-lg font-semibold ${low ? 'text-red-600' : 'text-gray-900'}`}>{ing.cantidad}</div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-600">{ing.unidad ?? '—'}</div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                        <div className={`text-sm ${low ? 'text-red-600' : 'text-gray-600'}`}>{ing.minimo}</div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          onClick={() => abrirModal(ing)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${low ? 'bg-red-600 text-white' : 'bg-green-50 text-green-700'}`}
                          aria-label={`Reabastecer ${ing.nombre}`}
                        >
                          <PackagePlus size={16} />
                          <span className="hidden sm:inline">Reabastecer</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t gap-2">
              <div className="text-sm text-gray-700">
                Página {currentPageClamped} de {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPageClamped === 1}
                  className="px-3 py-1 rounded-md border text-sm disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPageClamped === totalPages}
                  className="px-3 py-1 rounded-md border text-sm disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {ingredienteSeleccionado && (
        <ModalReabastecer
          isOpen={modalAbierto}
          onClose={cerrarModal}
          ingrediente={ingredienteSeleccionado}
          onConfirmar={confirmarReabastecimiento}
        />
      )}
    </div>
  );
}
