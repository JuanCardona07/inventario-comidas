import type { IReceta } from '../models/Receta';
import { IngredienteRepository } from '../repositories/IngredienteRepository';
import { RecetaRepository } from '../repositories/RecetaRepository';
import { AppError } from '../utils/AppError';
import { ErrorCodes } from '../utils/errorCodes';
import type { RecetaInput } from '../validators/schemas';

export class RecetaService {
  private repository: RecetaRepository;
  private ingredienteRepository: IngredienteRepository;

  constructor() {
    this.repository = new RecetaRepository();
    this.ingredienteRepository = new IngredienteRepository();
  }

  async getAllRecetas(): Promise<IReceta[]> {
    return await this.repository.findAll();
  }

  async getRecetaById(id: string): Promise<IReceta> {
    const receta = await this.repository.findById(id);
    if (!receta) {
      throw AppError.notFound(ErrorCodes.RECETA_NOT_FOUND);
    }
    return receta;
  }

  async createReceta(data: RecetaInput): Promise<IReceta> {
    const existing = await this.repository.findById(data.id);
    if (existing) {
      throw AppError.badRequest(
        ErrorCodes.RECETA_CREATE_ERROR,
        `Ya existe una receta con ID ${data.id}`
      );
    }

    const ingredienteIds = data.ingredientes.map(i => i.ingredienteId);
    const ingredientes = await this.ingredienteRepository.findByIds(ingredienteIds);

    if (ingredientes.length !== ingredienteIds.length) {
      const foundIds = ingredientes.map(i => i.id);
      const missingIds = ingredienteIds.filter(id => !foundIds.includes(id));

      throw AppError.badRequest(
        ErrorCodes.RECETA_CREATE_ERROR,
        `Ingredientes no encontrados: ${missingIds.join(', ')}`
      );
    }

    for (const ing of data.ingredientes) {
      if (ing.cantidad <= 0) {
        throw AppError.badRequest(
          ErrorCodes.VALIDATION_ERROR,
          `La cantidad del ingrediente ${ing.ingredienteId} debe ser mayor a 0`
        );
      }
    }

    return await this.repository.create(data);
  }

  async getRecetasByCategory(categoria: string): Promise<IReceta[]> {
    return await this.repository.findByCategory(categoria);
  }
}
