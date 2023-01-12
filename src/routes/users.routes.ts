import { verifyAdminMiddleware } from './../middlewares/verifyIsAdmin.middleware';
import { verifyTokenMiddleware } from './../middlewares/verifyToken.middleware';
import {
  createUserController,
  retrieveUsersController,
  retrieveEspecificUserController,
  updateUserController,
  deleteUserController,
} from "./../controllers/users.controllers";
import { Router } from "express";
import { verifyDataMiddleware } from "../middlewares/verifyData.middleware";
import { userSerializer } from "../schemas/users.schemas";

export const userRoutes = Router();

userRoutes.post("",verifyDataMiddleware(userSerializer),createUserController);
userRoutes.get("", retrieveUsersController);
userRoutes.get("/:id",verifyTokenMiddleware,verifyAdminMiddleware, retrieveEspecificUserController);
userRoutes.patch("/:id", updateUserController);
userRoutes.delete("/:id", deleteUserController);
