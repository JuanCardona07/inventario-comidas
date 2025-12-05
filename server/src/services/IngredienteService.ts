import type { IIngrediente } from '../models/Ingrediente';
import { IngredienteRepository } from '../repositories/IngredienteRepository';
import { AppError } from '../utils/AppError';
import { ErrorCodes } from '../utils/errorCodes';
import type { IngredienteInput } from '../validators/schemas';

export class IngredienteService {
  private repository: IngredienteRepository;

  constructor() {
    this.repository = new IngredienteRepository();
  }

  async getAllIngredientes(): Promise<IIngrediente[]> {
    return await this.repository.findAll();
  }

  async createIngrediente(data: IngredienteInput): Promise<IIngrediente> {
    // Validar que no exista otro ingrediente con el mismo ID
    const existing = await this.repository.findById(data.id);
    if (existing) {
      throw AppError.badRequest(
        ErrorCodes.INGREDIENTE_CREATE_ERROR,
        `Ya existe un ingrediente con ID ${data.id}`
      );
    }

    // Validación de negocio: la cantidad inicial debe ser >= al mínimo
    if (data.cantidad < data.minimo) {
      throw AppError.badRequest(
        ErrorCodes.VALIDATION_ERROR,
        'La cantidad inicial debe ser mayor o igual al mínimo'
      );
    }

    return await this.repository.create(data);
  }

  async updateIngrediente(id: string, data: Partial<IngredienteInput>): Promise<IIngrediente> {
    const ingrediente = await this.repository.findById(id);
    if (!ingrediente) {
      throw AppError.notFound(ErrorCodes.INGREDIENTE_NOT_FOUND);
    }

    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw AppError.internal(ErrorCodes.INGREDIENTE_UPDATE_ERROR);
    }

    return updated;
  }

  async restockIngrediente(id: string, cantidad: number): Promise<IIngrediente> {
    const ingrediente = await this.repository.findById(id);
    if (!ingrediente) {
      throw AppError.notFound(ErrorCodes.INGREDIENTE_NOT_FOUND);
    }

    const updated = await this.repository.incrementQuantity(id, cantidad);
    if (!updated) {
      throw AppError.internal(ErrorCodes.INGREDIENTE_UPDATE_ERROR);
    }

    return updated;
  }

  async resetAllIngredientes(): Promise<IIngrediente[]> {
    const ingredientesIniciales = [
      { id: "1", cantidad: 50 },
      { id: "2", cantidad: 30 },
      { id: "3", cantidad: 40 },
      { id: "4", cantidad: 35 },
      { id: "5", cantidad: 45 },
      { id: "6", cantidad: 100 },
      { id: "7", cantidad: 2000 },
      { id: "8", cantidad: 25 },
      { id: "9", cantidad: 30 },
      { id: "10", cantidad: 20 },
      { id: "11", cantidad: 15 },
    ];

    for (const ing of ingredientesIniciales) {
      await this.repository.resetQuantity(ing.id, ing.cantidad);
    }

    return await this.repository.findAll();
  }

  async getLowStockIngredientes(): Promise<IIngrediente[]> {
    return await this.repository.findLowStock();
  }

  async checkAvailability(
    ingredientesRequeridos: Array<{ ingredienteId: string; cantidad: number }>,
    multiplier: number = 1
  ): Promise<{ available: boolean; missing?: string }> {
    for (const req of ingredientesRequeridos) {
      const ingrediente = await this.repository.findById(req.ingredienteId);

      if (!ingrediente) {
        return {
          available: false,
          missing: `Ingrediente ${req.ingredienteId} no encontrado`
        };
      }

      const cantidadRequerida = req.cantidad * multiplier;
      if (ingrediente.cantidad < cantidadRequerida) {
        return {
          available: false,
          missing: `${ingrediente.nombre} insuficiente (disponible: ${ingrediente.cantidad}, requerido: ${cantidadRequerida})`
        };
      }
    }

    return { available: true };
  }

  async deductIngredientes(
    ingredientesRequeridos: Array<{ ingredienteId: string; cantidad: number }>,
    multiplier: number = 1
  ): Promise<void> {
    for (const req of ingredientesRequeridos) {
      const cantidadADescontar = req.cantidad * multiplier;
      await this.repository.decrementQuantity(req.ingredienteId, cantidadADescontar);
    }
  }
}
