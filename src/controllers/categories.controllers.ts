import { Request, Response } from "express";
import { createCategoryService } from "../services/categories/createCategory.service";
import { deleteCategoryService } from "../services/categories/deleteCategory.service";
import { listAllProductCategoryService } from "../services/categories/listAllProductCategory.service";
import { retrieveCategoriesService } from "../services/categories/retrieveCategories.service";
import { retrieveEspecificCategoryService } from "../services/categories/retrieveEspecificCategory.service";
import { updateCategoryService } from "../services/categories/updateCategory.service";

export const createCategoryController = async (req: Request, res: Response) => {
  const newCategory = await createCategoryService(req.body);
  return res.status(201).json(newCategory);
};

export const retrieveCategoriesController = async (
  req: Request,
  res: Response
) => {
  const listAllCategory = await retrieveCategoriesService();
  return res.status(200).json(listAllCategory);
};

export const retrieveEspecificCategoryController = async (
  req: Request,
  res: Response
) => {
  const listSingleCategory = await retrieveEspecificCategoryService(
    req.params.id
  );
  return res.status(200).json(listSingleCategory);
};

export const listAllProductCategoryController = async (
  req: Request,
  res: Response
) => {
  const listAllProduct = await listAllProductCategoryService(req.params.id);

  return res.status(200).json(listAllProduct);
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const updatedCategory = await updateCategoryService(req.params.id, req.body);
  return res.status(200).json(updatedCategory);
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const message = await deleteCategoryService(req.params.id);
  return res.status(204).json(message);
};
