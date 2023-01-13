import dataSource from "../../data-source";
import { Product } from "../../entities/product.entity";
import { AppError } from "../../errors/AppError";
import { IProductRequest } from "../../interfaces/products.interface";

export const retrieveEspecificProductService = async (
  idProduct: string
): Promise<IProductRequest> => {
  const productRepo = dataSource.getRepository(Product);
  const product = await productRepo.findOne({where: {id: idProduct}, relations: {
    category: true
  }});
  
  if (!product) {
    throw new AppError("Product not found", 400);
  }

  return product;
};
