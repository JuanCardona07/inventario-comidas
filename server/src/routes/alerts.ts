import { NextFunction, Request, Response, Router } from 'express';
import { IngredienteService } from '../services/IngredienteService';
import { emailAlertService } from '../services/emailAlertService';
import type { Ingrediente as IngredienteType } from '../types';

const router = Router();
const ingredienteService = new IngredienteService();

// POST /api/alerts/check
router.post('/check', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ingredientes = await ingredienteService.getAllIngredientes();

    const ingredientesPlanos = ingredientes.map(ing => ({
      id: ing.id,
      nombre: ing.nombre,
      cantidad: ing.cantidad,
      minimo: ing.minimo,
      unidad: ing.unidad,
      categoria: ing.categoria || 'otros'
    })) as IngredienteType[];

    await emailAlertService.checkAndSendAlerts(ingredientesPlanos);

    const ingredientesBajos = ingredientesPlanos.filter(
      (ing) => ing.cantidad <= ing.minimo
    );

    res.json({
      success: true,
      ingredientesBajos: ingredientesBajos.length,
      message: ingredientesBajos.length > 0
        ? `${ingredientesBajos.length} ingrediente(s) con stock bajo`
        : 'Todos los ingredientes tienen stock suficiente'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/alerts/force
router.post('/force', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ingredientes = await ingredienteService.getAllIngredientes();

    const ingredientesPlanos = ingredientes.map(ing => ({
      id: ing.id,
      nombre: ing.nombre,
      cantidad: ing.cantidad,
      minimo: ing.minimo,
      unidad: ing.unidad,
      categoria: ing.categoria || 'otros'
    })) as IngredienteType[];

    await emailAlertService.forceAlert(ingredientesPlanos);

    res.json({
      success: true,
      message: 'Alerta enviada (si hay ingredientes con stock bajo)'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
