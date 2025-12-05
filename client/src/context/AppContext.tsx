import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { useToast } from "../hooks/useToast";
import {
  ingredientesService,
  ordenesService,
  recetasService,
} from "../services";
import type { Ingrediente, Orden, Receta } from "../types";

interface AppContextType {
  ingredientes: Ingrediente[];
  recetas: Receta[];
  ordenes: Orden[];
  loading: boolean;
  processingOrder: boolean;

  ingredientesCargados: boolean;
  recetasCargadas: boolean;
  ordenesCargadas: boolean;

  procesarOrden: (recetaId: string, cantidad: number) => Promise<void>;
  reabastecerIngrediente: (
    ingredienteId: string,
    cantidad: number
  ) => Promise<void>;
  refrescarIngredientes: () => Promise<void>;
  refrescarRecetas: () => Promise<void>;
  refrescarOrdenes: () => Promise<void>;
  toasts: any[];
  showToast: (message: string, type: "success" | "error" | "warning") => void;
  removeToast: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false); // ⭐ NUEVO

  const [ingredientesCargados, setIngredientesCargados] = useState(false);
  const [recetasCargadas, setRecetasCargadas] = useState(false);
  const [ordenesCargadas, setOrdenesCargadas] = useState(false);

  const { toasts, showToast, removeToast } = useToast();

  const refrescarIngredientes = async () => {
    try {
      setLoading(true);
      const data = await ingredientesService.getAll();
      setIngredientes(data);
      setIngredientesCargados(true);
    } catch (error) {
      showToast("Error al cargar ingredientes", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refrescarRecetas = async () => {
    try {
      setLoading(true);
      const data = await recetasService.getAll();
      setRecetas(data);
      setRecetasCargadas(true);
    } catch (error) {
      showToast("Error al cargar recetas", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refrescarOrdenes = async () => {
    try {
      setLoading(true);
      const data = await ordenesService.getAll();
      setOrdenes(data);
      setOrdenesCargadas(true);
    } catch (error) {
      showToast("Error al cargar órdenes", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarIngredientesLocalmente = (recetaId: string, cantidad: number) => {
    const receta = recetas.find((r) => r.id === recetaId);
    if (!receta || !receta.ingredientes) return;

    setIngredientes((prevIngredientes) =>
      prevIngredientes.map((ing) => {
        const recetaIng = receta.ingredientes.find(
          (ri) => ri.ingredienteId === ing.id
        );
        if (recetaIng) {
          return {
            ...ing,
            cantidad: Math.max(0, ing.cantidad - recetaIng.cantidad * cantidad),
          };
        }
        return ing;
      })
    );
  };

  const procesarOrden = async (recetaId: string, cantidad: number) => {
    if (processingOrder) return;

    try {
      setProcessingOrder(true);

      const receta = recetas.find((r) => r.id === recetaId);

      actualizarIngredientesLocalmente(recetaId, cantidad);

      const nuevaOrden = await ordenesService.create(recetaId, cantidad);

      setOrdenes((prev) => [nuevaOrden, ...prev]);

      showToast(
        `✅ Orden procesada: ${cantidad}x ${receta?.nombre}`,
        "success"
      );

      ingredientesService.getAll().then(data => {
        setIngredientes(data);
      }).catch(err => {
        console.error('Error al sincronizar ingredientes:', err);
      });

    } catch (error: any) {
      await refrescarIngredientes();

      const mensaje =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al procesar la orden";
      showToast(mensaje, "error");
      console.error(error);
    } finally {
      setProcessingOrder(false);
    }
  };

  const reabastecerIngrediente = async (
    ingredienteId: string,
    cantidad: number
  ) => {
    try {
      setIngredientes((prev) =>
        prev.map((ing) =>
          ing.id === ingredienteId
            ? { ...ing, cantidad: ing.cantidad + cantidad }
            : ing
        )
      );

      await ingredientesService.reabastecer(ingredienteId, cantidad);

      const ingrediente = ingredientes.find((i) => i.id === ingredienteId);
      showToast(
        `✅ Reabastecido: +${cantidad} ${ingrediente?.unidad} de ${ingrediente?.nombre}`,
        "success"
      );

      refrescarIngredientes();
    } catch (error: any) {
      await refrescarIngredientes();

      const mensaje =
        error.response?.data?.error || "Error al reabastecer ingrediente";
      showToast(mensaje, "error");
      console.error(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ingredientes,
        recetas,
        ordenes,
        loading,
        processingOrder, // ⭐ NUEVO
        ingredientesCargados,
        recetasCargadas,
        ordenesCargadas,
        procesarOrden,
        reabastecerIngrediente,
        refrescarIngredientes,
        refrescarRecetas,
        refrescarOrdenes,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de AppProvider");
  }
  return context;
}
