import Receta, { IReceta } from '../models/Receta';
import type { RecetaInput } from '../validators/schemas';

export class RecetaRepository {
  async findAll(): Promise<IReceta[]> {
    return await Receta.find();
  }

  async findById(id: string): Promise<IReceta | null> {
    return await Receta.findOne({ id });
  }

  async create(data: RecetaInput): Promise<IReceta> {
    const receta = new Receta(data);
    return await receta.save();
  }

  async update(id: string, data: Partial<RecetaInput>): Promise<IReceta | null> {
    return await Receta.findOneAndUpdate(
      { id },
      data,
      { new: true }
    );
  }

  async findByCategory(categoria: string): Promise<IReceta[]> {
    return await Receta.find({ categoria });
  }
}
