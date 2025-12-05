import { Minus, PackagePlus, Plus, X } from "lucide-react";
import { useState } from "react";
import type { Ingrediente } from "../types";

interface ModalReabastecerProps {
  isOpen: boolean;
  onClose: () => void;
  ingrediente: Ingrediente;
  onConfirmar: (ingredienteId: string, cantidad: number) => void;
}

export default function ModalReabastecer({
  isOpen,
  onClose,
  ingrediente,
  onConfirmar,
}: ModalReabastecerProps) {
  const [cantidadAAgregar, setCantidadAAgregar] = useState(10);

  if (!isOpen) return null;

  const handleConfirmar = () => {
    if (cantidadAAgregar > 0) {
      onConfirmar(ingrediente.id, cantidadAAgregar);
      setCantidadAAgregar(10);
      onClose();
    }
  };

  const incrementar = () => setCantidadAAgregar((prev) => prev + 1);
  const decrementar = () =>
    setCantidadAAgregar((prev) => Math.max(1, prev - 1));

  const nuevaCantidad = ingrediente.cantidad + cantidadAAgregar;
  const esStockBajo = ingrediente.cantidad <= ingrediente.minimo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <PackagePlus className="text-green-600" size={24} />
              Reabastecer Inventario
            </h3>
            <p className="text-sm text-gray-500 mt-1">{ingrediente.nombre}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div
          className={`p-4 rounded-lg mb-4 ${esStockBajo
            ? "bg-red-50 border border-red-200"
            : "bg-gray-50 border border-gray-200"
            }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Stock actual</p>
              <p
                className={`text-2xl font-bold ${esStockBajo ? "text-red-600" : "text-gray-900"
                  }`}
              >
                {ingrediente.cantidad} {ingrediente.unidad}
              </p>
              {esStockBajo && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Por debajo del mínimo ({ingrediente.minimo})
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Mínimo requerido</p>
              <p className="text-xl font-semibold text-gray-700">
                {ingrediente.minimo} {ingrediente.unidad}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Cuánto deseas agregar?
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={decrementar}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 transition-colors"
            >
              <Minus size={20} />
            </button>

            <input
              type="number"
              min="1"
              value={cantidadAAgregar}
              onChange={(e) =>
                setCantidadAAgregar(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-32 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg py-2 focus:outline-none focus:border-green-500"
            />

            <button
              onClick={incrementar}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 transition-colors"
            >
              <Plus size={20} />
            </button>

            <span className="text-gray-600 ml-2">{ingrediente.unidad}</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Nuevo stock</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-500 line-through">
                  {ingrediente.cantidad}
                </span>
                <span className="text-green-600 text-xl">→</span>
                <span className="text-2xl font-bold text-green-700">
                  {nuevaCantidad} {ingrediente.unidad}
                </span>
              </div>
            </div>
            {nuevaCantidad > ingrediente.minimo && esStockBajo && (
              <div className="text-green-600">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <PackagePlus size={20} />
            Reabastecer
          </button>
        </div>
      </div>
    </div>
  );
}
