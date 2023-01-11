import {
  createProductController,
  retrieveProductsController,
  retrieveEspecificProductController,
  updateProductController,
  deleteProductController,
} from "./../controllers/products.controllers";
import { Router } from "express";

export const productsRoutes = Router();

productsRoutes.post("", createProductController);
productsRoutes.get("", retrieveProductsController);
productsRoutes.get("/:id", retrieveEspecificProductController);
productsRoutes.patch("/:id", updateProductController);
productsRoutes.delete("/:id", deleteProductController);
