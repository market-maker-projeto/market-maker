import { verifyTokenMiddleware } from "./../middlewares/verifyToken.middleware";
import {
  createProductController,
  retrieveProductsController,
  retrieveEspecificProductController,
  updateProductController,
  deleteProductController,
} from "./../controllers/products.controllers";
import { Router } from "express";
import { verifyAdminMiddleware } from "../middlewares/verifyIsAdmin.middleware";
import { verifyDataMiddleware } from "../middlewares/verifyData.middleware";
import { productsSchema } from "../schemas/products.schemas";

export const productsRoutes = Router();

productsRoutes.post(
  "",
  verifyDataMiddleware(productsSchema),
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  createProductController
);
productsRoutes.get("", retrieveProductsController);
productsRoutes.get("/:id", retrieveEspecificProductController);
productsRoutes.patch(
  "/:id",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  updateProductController
);
productsRoutes.delete(
  "/:id",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  deleteProductController
);
