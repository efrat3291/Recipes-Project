import { Router } from "express";
import { getAllCategories, getRecipesByCategoryId, getAllRecipesByCategory } from "../controllers/category.controller";
import { checkAuth } from "../middlewares/auth.middleware.js";
const router = Router();

router.get('/', getAllCategories);
router.get('/', checkAuth, getAllRecipesByCategory);
router.get('/:id', getRecipesByCategoryId);

export default router;