import { Router } from "express";
import { addRecipe, deleteRecipe, getAllMyRecipes, getAllRecipes, getRecipeById, getRecipeByPreparingTime, updateRecipe } from "../controllers/recipe.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', getAllRecipes);
router.get('/',checkAuth, getAllMyRecipes);
router.get('/:id', getRecipeById);
router.get('/:prepare-time', getRecipeByPreparingTime);
router.post('/', checkAuth, addRecipe);
router.put('/:id', checkAuth, updateRecipe);
router.delete('/:id', checkAuth, deleteRecipe);

export default router;