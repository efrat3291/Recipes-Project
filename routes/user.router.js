import { Router } from "express";
import { getAllUsers, signIn, signUp, deleteUser, updateUser } from "../controllers/user.controller.js";
import { checkAuth, checkIsAdmin } from "../middlewares/auth.middleware.js";
import Joi from "joi";

const router = Router();

router.get('/', getAllUsers);
router.post('/sign-in', signIn);
router.post('/', signUp);
router.put('/:id', checkAuth, updateUser);
router.delete('/:id', checkAuth, checkIsAdmin, deleteUser);

export default router;
