import {
  createUserController,
  retrieveUsersController,
  retrieveEspecificUserController,
  updateUserController,
  deleteUserController,
} from "./../controllers/users.controllers";
import { Router } from "express";

export const userRoutes = Router();

userRoutes.post("", createUserController);
userRoutes.get("", retrieveUsersController);
userRoutes.get("/:id", retrieveEspecificUserController);
userRoutes.patch("/:id", updateUserController);
userRoutes.delete("/:id", deleteUserController);
