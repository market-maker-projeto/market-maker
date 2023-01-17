import AppDataSource from "../../data-source";
import { Category } from "../../entities/category.entity";
import { Product } from "../../entities/product.entity";
import { ICategoryProdResponse } from "../../interfaces/products.interface";

export const listAllProductCategoryService = async (
  idCategory: string
): Promise<ICategoryProdResponse[]> => {
  const productRepository = await AppDataSource.getRepository(Product);

  const listAllProduct = await productRepository.find({
    where: {
      category: { id: idCategory },
    },
  });

  const listAllProductResponse = listAllProduct.map((element) => {
    delete element.createdAt;
    delete element.deletedAt;
    delete element.updatedAt;
    delete element.category.createdAt;
    delete element.category.updatedAt;
    return element
  });

  return listAllProductResponse;
};
