import dataSource from "../../data-source";
import { Product } from "../../entities/product.entity";
import { AppError } from "../../errors/AppError";
import {
  IProductResponse,
  IProductUpdate,
} from "../../interfaces/products.interface";

export const updateProductService = async (
  prodData: IProductUpdate,
  prod_id: string
): Promise<IProductResponse> => {
  const productRepo = dataSource.getRepository(Product);
  const product = await productRepo.findOne({
    where: { id: prod_id },
    relations: { category: true },
  });

  if (!product) {
    throw new AppError("Product doesnt exists", 400);
  }

  const updateProduct = productRepo.create({
    ...product,
    ...prodData,
  });

  await productRepo.save(updateProduct);

  return updateProduct;
};
