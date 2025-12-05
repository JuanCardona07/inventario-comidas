import { NextFunction, Request, Response, Router } from "express";
import { OrdenService } from "../services/OrdenService";
import { CreateOrdenUseCase } from "../use-cases/CreateOrdenUseCase";
import { ordenSchema } from "../validators/schemas";

const router = Router();
const ordenService = new OrdenService();
const createOrdenUseCase = new CreateOrdenUseCase();

// GET /api/ordenes
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ordenes = await ordenService.getAllOrdenes();
    res.json(ordenes);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/ordenes/reset
router.delete("/reset", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ordenService.deleteAllOrdenes();
    res.json({
      message: "Todas las órdenes han sido eliminadas",
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/ordenes - Usa el caso de uso
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validar entrada
    const validatedData = ordenSchema.parse(req.body);

    // Ejecutar caso de uso
    const orden = await createOrdenUseCase.execute(validatedData);

    res.status(201).json(orden);
  } catch (error) {
    next(error);
  }
});

export default router;
