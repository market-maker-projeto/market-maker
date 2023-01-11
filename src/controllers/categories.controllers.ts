import { Request, Response } from "express";

export const createCategoryController = async (req: Request, res: Response) => {
  return res.status(201).json();
};

export const retrieveCategoriesController = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json();
};

export const retrieveEspecificCategoryController = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json();
};

export const updateCategoryController = async (req: Request, res: Response) => {
  return res.status(200).json();
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  return res.status(204).json();
};
