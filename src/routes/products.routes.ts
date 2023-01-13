import { verifyTokenMiddleware } from './../middlewares/verifyToken.middleware';
import {
  createProductController,
  retrieveProductsController,
  retrieveEspecificProductController,
  updateProductController,
  deleteProductController,
} from "./../controllers/products.controllers";
import { Router } from "express";
import { verifyAdminMiddleware } from "../middlewares/verifyIsAdmin.middleware";

export const productsRoutes = Router();

productsRoutes.post("", verifyTokenMiddleware,verifyAdminMiddleware, createProductController);
productsRoutes.get("", retrieveProductsController);
productsRoutes.get("/:id",retrieveEspecificProductController);
productsRoutes.patch("/:id", verifyTokenMiddleware,verifyAdminMiddleware, updateProductController);
productsRoutes.delete("/:id", verifyTokenMiddleware,verifyAdminMiddleware, deleteProductController);
