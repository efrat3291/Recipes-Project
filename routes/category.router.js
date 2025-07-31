import { Router } from "express";
import { getAllCategories, getRecipesByCategoryId, getAllRecipesByCategory } from "../controllers/category.controller";

const router = Router();

router.get('/', getAllCategories);
router.get('/', getAllRecipesByCategory);
router.get('/:id', getRecipesByCategoryId);

export default router;