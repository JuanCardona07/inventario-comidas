import type { IOrden } from '../models/Orden';
import { OrdenRepository } from '../repositories/OrdenRepository';

export class OrdenService {
  private repository: OrdenRepository;

  constructor() {
    this.repository = new OrdenRepository();
  }

  async getAllOrdenes(): Promise<IOrden[]> {
    return await this.repository.findAll();
  }

  async deleteAllOrdenes(): Promise<void> {
    await this.repository.deleteAll();
  }

  async getTodayOrdenes(): Promise<IOrden[]> {
    return await this.repository.findToday();
  }

  generateOrdenId(): string {
    return `ord-${Date.now()}`;
  }

  getFechaHoraColombia(): { fecha: string; hora: string } {
    const ahora = new Date();

    const colombiaOffset = -5 * 60; // minutos
    const localTime = new Date(ahora.getTime() + colombiaOffset * 60 * 1000);

    const año = localTime.getUTCFullYear();
    const mes = String(localTime.getUTCMonth() + 1).padStart(2, '0');
    const dia = String(localTime.getUTCDate()).padStart(2, '0');
    const hora = String(localTime.getUTCHours()).padStart(2, '0');
    const minuto = String(localTime.getUTCMinutes()).padStart(2, '0');

    return {
      fecha: `${año}-${mes}-${dia}`,
      hora: `${hora}:${minuto}`,
    };
  }
}
