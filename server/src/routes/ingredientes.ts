import { NextFunction, Request, Response, Router } from "express";
import { IngredienteService } from "../services/IngredienteService";
import { ingredienteSchema, restockSchema } from "../validators/schemas";

const router = Router();
const ingredienteService = new IngredienteService();

// GET /api/ingredientes
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ingredientes = await ingredienteService.getAllIngredientes();
    res.json(ingredientes);
  } catch (error) {
    next(error);
  }
});

// POST /api/ingredientes
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = ingredienteSchema.parse(req.body);
    const ingrediente = await ingredienteService.createIngrediente(validatedData);
    res.status(201).json(ingrediente);
  } catch (error) {
    next(error);
  }
});

// PUT /api/ingredientes/:id
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = ingredienteSchema.parse(req.body);
    const ingrediente = await ingredienteService.updateIngrediente(req.params.id, validatedData);
    res.json(ingrediente);
  } catch (error) {
    next(error);
  }
});

// POST /api/ingredientes/:id/restock
router.post("/:id/restock", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cantidad } = restockSchema.parse(req.body);
    const ingrediente = await ingredienteService.restockIngrediente(req.params.id, cantidad);
    res.json(ingrediente);
  } catch (error) {
    next(error);
  }
});

// POST /api/ingredientes/reset-all
router.post("/reset-all", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ingredientes = await ingredienteService.resetAllIngredientes();
    res.json({ message: "Inventario reabastecido", ingredientes });
  } catch (error) {
    next(error);
  }
});

export default router;
