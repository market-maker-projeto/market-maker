import AppDataSource from "../../data-source";
import { Category } from "../../entities/category.entity";
import { Product } from "../../entities/product.entity";
import { IProductResponse } from "../../interfaces/products.interface";

export const listAllProductCategoryService = async (
  idCategory: string
): Promise<IProductResponse[]> => {
  const productRepository = await AppDataSource.getRepository(Product);

  const listAllProduct = await productRepository.find({
    where: {
      category: { id: idCategory },
    }
  });
  return listAllProduct;
};
