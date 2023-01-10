import {
  createCategoryController,
  deleteCategoryController,
  retrieveCategoriesController,
  retrieveEspecificCategoryController,
  updateCategoryController,
} from "./../controllers/categories.controllers";
import { Router } from "express";

export const categoriesRoutes = Router();

categoriesRoutes.post("", createCategoryController);
categoriesRoutes.get("", retrieveCategoriesController);
categoriesRoutes.get("/:id", retrieveEspecificCategoryController);
categoriesRoutes.patch("/:id", updateCategoryController);
categoriesRoutes.delete("/:id", deleteCategoryController);
