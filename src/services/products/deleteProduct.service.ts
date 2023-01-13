import dataSource from "../../data-source";
import { Product } from "../../entities/product.entity";
import { AppError } from "../../errors/AppError";
import { IProductRequest } from "../../interfaces/products.interface";

export const deleteProductService = async (prod_id: string) => {
  const productRepo = dataSource.getRepository(Product);
  const product: IProductRequest = await productRepo.findOneBy({ id: prod_id });

  if (!product.id) {
    throw new AppError("Product not found", 404);
  }

  await productRepo.delete(product);
  return {};
};
