import { Request, Response } from "express";
import {
  IProduct,
  IProductRequest,
  IProductRequestCategory,
} from "../../src/interfaces/products.interface";
import { createProductService } from "../services/products/createProduct.service";
import { deleteProductService } from "../services/products/deleteProduct.service";
import { retrieveEspecificProductService } from "../services/products/retrieveEspecificProduct.service";
import { retrieveProductsService } from "../services/products/retrieveProducts.service";
import { updateProductService } from "../services/products/updateProduct.service";

export const createProductController = async (req: Request, res: Response) => {
  const productData: IProductRequestCategory = req.body;
  const newProduct = await createProductService(productData);
  return res.status(201).json(newProduct);
};

export const retrieveProductsController = async (
  req: Request,
  res: Response
) => {
  const products = await retrieveProductsService();
  return res.status(200).json(products);
};

export const retrieveEspecificProductController = async (
  req: Request,
  res: Response
) => {
  const product = await retrieveEspecificProductService(req.params.id);
  return res.status(200).json(product);
};

export const updateProductController = async (req: Request, res: Response) => {
  const productData: IProduct = req.body;
  const data = await updateProductService(productData, req.params.id);
  return res.status(200).json(data);
};

export const deleteProductController = async (req: Request, res: Response) => {
  const id = await deleteProductService(req.params.id);
  return res.status(204).json({});
};
