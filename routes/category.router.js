import { Router } from "express";
import { getAllCategories, getAllCategoriesAndRecipes, getCategoryById } from "../controllers/category.controller";

const router = Router();

router.get('/', getAllCategories);
router.get('/', getAllCategoriesAndRecipes);
router.get('/:id', getCategoryById);

export default router;