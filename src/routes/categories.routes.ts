import {
  createCategoryController,
  deleteCategoryController,
  listAllProductCategoryController,
  retrieveCategoriesController,
  retrieveEspecificCategoryController,
  updateCategoryController,
} from "./../controllers/categories.controllers";
import { Router } from "express";
import { verifyAdminMiddleware } from "../middlewares/verifyIsAdmin.middleware";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware";
import { categorySchema } from "../schemas/categories.schemas";
import { verifyDataMiddleware } from "../middlewares/verifyData.middleware";
import { listAllProductSchema } from "../schemas/products.schemas";

export const categoriesRoutes = Router();

categoriesRoutes.post(
  "",
  verifyDataMiddleware(categorySchema),
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  createCategoryController
);
categoriesRoutes.get("", verifyTokenMiddleware, retrieveCategoriesController);
categoriesRoutes.get(
  "/:id",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  retrieveEspecificCategoryController
);
categoriesRoutes.get(
  "/product/:id",

  verifyTokenMiddleware,
  listAllProductCategoryController
);
categoriesRoutes.patch(
  "/:id",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  updateCategoryController
);
categoriesRoutes.delete(
  "/:id",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  deleteCategoryController
);
