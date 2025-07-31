import { Router } from "express";
import { addRecipe, deleteRecipe, getAllMyRecipes, getAllRecipes, getRecipeById, getRecipeByPreparingTime, updateRecipe } from "../controllers/recipe.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', getAllRecipes);
router.get('/my-recipes',checkAuth, getAllMyRecipes);
router.get('/by-id/:_id', getRecipeById);
router.get('/by-prepare-time/:preparationTime', getRecipeByPreparingTime);
router.post('/', checkAuth, addRecipe);
router.put('/:_id', checkAuth, updateRecipe);
router.delete('/:_id', checkAuth, deleteRecipe);

export default router;