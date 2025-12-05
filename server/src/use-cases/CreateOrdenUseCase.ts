import type { IOrden } from '../models/Orden';
import { OrdenRepository } from '../repositories/OrdenRepository';
import { emailAlertService } from '../services/emailAlertService';
import { IngredienteService } from '../services/IngredienteService';
import { OrdenService } from '../services/OrdenService';
import { RecetaService } from '../services/RecetaService';
import type { Ingrediente as IngredienteType } from '../types';
import { AppError } from '../utils/AppError';
import { ErrorCodes } from '../utils/errorCodes';

export interface CreateOrdenInput {
  recetaId: string;
  cantidad: number;
}

export class CreateOrdenUseCase {
  private recetaService: RecetaService;
  private ingredienteService: IngredienteService;
  private ordenService: OrdenService;
  private ordenRepository: OrdenRepository;

  constructor() {
    this.recetaService = new RecetaService();
    this.ingredienteService = new IngredienteService();
    this.ordenService = new OrdenService();
    this.ordenRepository = new OrdenRepository();
  }

  async execute(input: CreateOrdenInput): Promise<IOrden> {
    const { recetaId, cantidad } = input;

    const receta = await this.recetaService.getRecetaById(recetaId);

    const availability = await this.ingredienteService.checkAvailability(
      receta.ingredientes,
      cantidad
    );

    if (!availability.available) {
      throw AppError.badRequest(
        ErrorCodes.INGREDIENTE_INSUFFICIENT,
        availability.missing || 'No hay suficientes ingredientes'
      );
    }

    await this.ingredienteService.deductIngredientes(receta.ingredientes, cantidad);

    const { fecha, hora } = this.ordenService.getFechaHoraColombia();

    const orden = await this.ordenRepository.create({
      id: this.ordenService.generateOrdenId(),
      recetaId: receta.id,
      recetaNombre: receta.nombre,
      cantidad,
      fecha,
      hora,
      total: receta.precio * cantidad,
      categoria: receta.categoria,
    });

    this.checkLowStockAlerts().catch(err => {
      console.error('⚠️ Error al verificar alertas:', err);
    });

    return orden;
  }

  private async checkLowStockAlerts(): Promise<void> {
    try {
      const todosIngredientes = await this.ingredienteService.getAllIngredientes();

      const ingredientesPlanos = todosIngredientes.map(ing => ({
        id: ing.id,
        nombre: ing.nombre,
        cantidad: ing.cantidad,
        minimo: ing.minimo,
        unidad: ing.unidad,
        categoria: ing.categoria || 'otros'
      })) as IngredienteType[];

      await emailAlertService.checkAndSendAlerts(ingredientesPlanos);
    } catch (error) {
      console.error('Error al procesar alertas:', error);
    }
  }
}
