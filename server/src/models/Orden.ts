import mongoose, { Document, Schema } from 'mongoose';

export interface IOrden extends Document {
  id: string;
  recetaId: string;
  recetaNombre: string;
  cantidad: number;
  fecha: string;
  hora: string;
  total: number;
  categoria?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrdenSchema = new Schema({
  id: { type: String, required: true, unique: true },
  recetaId: { type: String, required: true },
  recetaNombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  total: { type: Number, required: true },
  categoria: { type: String },
}, {
  timestamps: true,
  collection: 'ordenes'
});

export default mongoose.model<IOrden>('Orden', OrdenSchema);
