import dataSource from "../../data-source";
import { Product } from "../../entities/product.entity";
import { IProductRequest } from "../../interfaces/products.interface";

export const retrieveProductsService = async (): Promise<IProductRequest[]> => {
  const productRepo = dataSource.getRepository(Product);

  const products = await productRepo.find();

  return products;
};
