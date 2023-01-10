import { Request, Response } from "express";

export const createProductController = async (req: Request, res: Response) => {
  return res.status(201).json();
};

export const retrieveProductsController = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json();
};

export const retrieveEspecificProductController = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json();
};

export const updateProductController = async (req: Request, res: Response) => {
  return res.status(200).json();
};

export const deleteProductController = async (req: Request, res: Response) => {
  return res.status(204).json();
};
