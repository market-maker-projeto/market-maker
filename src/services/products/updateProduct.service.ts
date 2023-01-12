import dataSource from "../../data-source";
import { Product } from "../../entities/product.entity";
import { AppError } from "../../errors/AppError";
import { IProduct } from "../../interfaces/products.interface";

export const updateProductService = async (
  prodData: IProduct,
  prod_id: string
) => {
  const productRepo = dataSource.getRepository(Product);
  const product = await productRepo.findOneBy({ id: prod_id });

  if (!product) {
    throw new AppError("product that doesnt exists", 400);
  }

  const updateProduct = productRepo.create({
    ...product,
    ...prodData,
  });

  await productRepo.save(updateProduct);

  return updateProduct;
};
