import { z } from 'zod';

export const ingredienteSchema = z.object({
  id: z.string().min(1, 'El ID es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  cantidad: z.number().nonnegative('La cantidad debe ser mayor o igual a 0'),
  unidad: z.string().min(1, 'La unidad es requerida'),
  minimo: z.number().nonnegative('El mínimo debe ser mayor o igual a 0'),
  categoria: z.string().optional(),
});

export const restockSchema = z.object({
  cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
});

export const recetaSchema = z.object({
  id: z.string().min(1, 'El ID es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  ingredientes: z.array(
    z.object({
      ingredienteId: z.string().min(1, 'El ID del ingrediente es requerido'),
      cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
    })
  ).min(1, 'Debe tener al menos un ingrediente'),
});

export const ordenSchema = z.object({
  recetaId: z.string().min(1, 'El ID de la receta es requerido'),
  cantidad: z.number().positive('La cantidad debe ser mayor a 0').int('La cantidad debe ser un número entero'),
});

export type IngredienteInput = z.infer<typeof ingredienteSchema>;
export type RestockInput = z.infer<typeof restockSchema>;
export type RecetaInput = z.infer<typeof recetaSchema>;
export type OrdenInput = z.infer<typeof ordenSchema>;
