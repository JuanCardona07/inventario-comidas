import Ingrediente, { IIngrediente } from '../models/Ingrediente';
import type { IngredienteInput } from '../validators/schemas';

export class IngredienteRepository {
  async findAll(): Promise<IIngrediente[]> {
    return await Ingrediente.find();
  }

  async findById(id: string): Promise<IIngrediente | null> {
    return await Ingrediente.findOne({ id });
  }

  async findByIds(ids: string[]): Promise<IIngrediente[]> {
    return await Ingrediente.find({ id: { $in: ids } });
  }

  async create(data: IngredienteInput): Promise<IIngrediente> {
    const ingrediente = new Ingrediente(data);
    return await ingrediente.save();
  }

  async update(id: string, data: Partial<IngredienteInput>): Promise<IIngrediente | null> {
    return await Ingrediente.findOneAndUpdate(
      { id },
      data,
      { new: true }
    );
  }

  async incrementQuantity(id: string, cantidad: number): Promise<IIngrediente | null> {
    return await Ingrediente.findOneAndUpdate(
      { id },
      { $inc: { cantidad } },
      { new: true }
    );
  }

  async decrementQuantity(id: string, cantidad: number): Promise<IIngrediente | null> {
    return await Ingrediente.findOneAndUpdate(
      { id },
      { $inc: { cantidad: -cantidad } },
      { new: true }
    );
  }

  async resetQuantity(id: string, cantidad: number): Promise<IIngrediente | null> {
    return await Ingrediente.findOneAndUpdate(
      { id },
      { cantidad },
      { new: true }
    );
  }

  async findLowStock(): Promise<IIngrediente[]> {
    return await Ingrediente.find({
      $expr: { $lte: ['$cantidad', '$minimo'] }
    });
  }
}
