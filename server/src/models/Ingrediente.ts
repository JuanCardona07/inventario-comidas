import mongoose, { Document, Schema } from "mongoose";

export interface IIngrediente extends Document {
  id: string;
  nombre: string,
  cantidad: number,
  unidad: string,
  minimo: number,
  categoria?: string;
}

const IngredienteSchema = new Schema({
  id: { type: String, required: true, unique: true},
  nombre: { type: String, required: true},
  cantidad: { type: Number, required: true},
  unidad: { type: String, required: true},
  minimo: { type: Number, required: true},
  categoria: { type: String},

}, {
  timestamps: true,
  collection: 'inventario'
});

export default mongoose.model<IIngrediente>('Ingrediente', IngredienteSchema);
