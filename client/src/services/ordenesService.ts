import type { Orden } from "../types";
import api from "./api";

export const ordenesService = {
  getAll: async (): Promise<Orden[]> => {
    const response = await api.get("/ordenes");
    return response.data;
  },

  create: async (recetaId: string, cantidad: number): Promise<Orden> => {
    const response = await api.post("/ordenes", { recetaId, cantidad });
    return response.data;
  },
};
