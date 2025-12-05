import Orden, { IOrden } from '../models/Orden';

export interface CreateOrdenData {
  id: string;
  recetaId: string;
  recetaNombre: string;
  cantidad: number;
  fecha: string;
  hora: string;
  total: number;
  categoria?: string;
}

export class OrdenRepository {
  async findAll(): Promise<IOrden[]> {
    return await Orden.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IOrden | null> {
    return await Orden.findOne({ id });
  }

  async create(data: CreateOrdenData): Promise<IOrden> {
    const orden = new Orden(data);
    return await orden.save();
  }

  async deleteAll(): Promise<void> {
    await Orden.deleteMany({});
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IOrden[]> {
    return await Orden.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ createdAt: -1 });
  }

  async findToday(): Promise<IOrden[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.findByDateRange(today, tomorrow);
  }
}
