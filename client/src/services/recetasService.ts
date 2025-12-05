import type { Receta } from "../types";
import api from "./api";

export const recetasService = {
  getAll: async (): Promise<Receta[]> => {
    const response = await api.get("/recetas");
    return response.data;
  },

  create: async (receta: Receta): Promise<Receta> => {
    const response = await api.post("/recetas", receta);
    return response.data;
  },
};
