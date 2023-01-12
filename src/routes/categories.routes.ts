import {
  createCategoryController,
  deleteCategoryController,
  retrieveCategoriesController,
  retrieveEspecificCategoryController,
  updateCategoryController,
} from "./../controllers/categories.controllers";
import { Router } from "express";
import { verifyAdminMiddleware } from "../middlewares/verifyIsAdmin.middleware";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware";

export const categoriesRoutes = Router();

categoriesRoutes.post(
  "",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  createCategoryController
);
categoriesRoutes.get("", verifyTokenMiddleware, retrieveCategoriesController);
categoriesRoutes.get("/:id", retrieveEspecificCategoryController);
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
