import mongoose, { Document, Schema } from 'mongoose';

interface RecetaIngrediente {
  ingredienteId: string;
  cantidad: number;
}

export interface IReceta extends Document {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  ingredientes: RecetaIngrediente[];
}

const RecetaSchema = new Schema({
  id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  ingredientes: [{
    ingredienteId: { type: String, required: true },
    cantidad: { type: Number, required: true }
  }]
}, {
  timestamps: true,
  collection: 'recetas'
});

export default mongoose.model<IReceta>('Receta', RecetaSchema);
