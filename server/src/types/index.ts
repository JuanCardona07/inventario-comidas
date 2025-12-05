export interface Ingrediente {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  minimo: number;
  categoria: string;
}

export interface RecetaIngrediente {
  ingredienteId: string;
  cantidad: number;
}

export interface Receta {
  id: string;
  nombre: string;
  ingredientes: RecetaIngrediente[];
  precio: number;
  categoria: string;
}

export interface Orden {
  id: string;
  recetaId: string;
  recetaNombre: string;
  cantidad: number;
  fecha: string;
  hora: string;
  total: number;
  categoria?: string;
}

export interface DiaResumen {
  fecha: string;
  ordenes: Orden[];
  totalVentas: number;
  ingredientesUsados: {
    [ingredienteId: string]: number;
  }
}

export type CategoriaReceta = 'Hamburguesas' | 'Arepas' | 'Salchipapa' | 'Perros' | 'Carnes' | 'Patacones' | 'Bebidas';
export type CategoriaIngrediente = 'Carnes' | 'Verduras' | 'Panes' | 'Salsas' | 'Lacteos' | 'Otros';
