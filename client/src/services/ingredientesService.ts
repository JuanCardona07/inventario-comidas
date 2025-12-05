import type { Ingrediente } from "../types";
import api from "./api";

export const ingredientesService = {
  getAll: async (): Promise<Ingrediente[]> => {
    const response = await api.get("/ingredientes");
    return response.data;
  },

  create: async (ingrediente: Ingrediente): Promise<Ingrediente> => {
    const response = await api.post("/ingredientes", ingrediente);
    return response.data;
  },

  update: async (
    id: string,
    ingrediente: Partial<Ingrediente>
  ): Promise<Ingrediente> => {
    const response = await api.put(`/ingredientes/${id}`, ingrediente);
    return response.data;
  },

  reabastecer: async (id: string, cantidad: number): Promise<Ingrediente> => {
    const response = await api.post(`/ingredientes/${id}/restock`, {
      cantidad,
    });
    return response.data;
  },
};
