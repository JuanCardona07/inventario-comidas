import { NextFunction, Request, Response, Router } from "express";
import { RecetaService } from "../services/RecetaService";
import { recetaSchema } from "../validators/schemas";

const router = Router();
const recetaService = new RecetaService();

// GET /api/recetas
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recetas = await recetaService.getAllRecetas();
    res.json(recetas);
  } catch (error) {
    next(error);
  }
});

// POST /api/recetas
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = recetaSchema.parse(req.body);
    const receta = await recetaService.createReceta(validatedData);
    res.status(201).json(receta);
  } catch (error) {
    next(error);
  }
});

export default router;
