import AppDataSource from "../../data-source";
import { Category } from "../../entities/category.entity";
import { Product } from "../../entities/product.entity";
import { ICategoryProdResponse } from "../../interfaces/products.interface";
import { listAllProdutSchema } from "../../schemas/products.schemas";

export const listAllProductCategoryService = async (
  idCategory: string
): Promise<ICategoryProdResponse[]> => {
  const productRepository = await AppDataSource.getRepository(Product);

  const listAllProduct = await productRepository.find({
    where: {
      category: { id: idCategory },
    },
  });

  const categoryReturn = await listAllProdutSchema.validate(listAllProduct,{
    stripUnknown: true
}) 

  return categoryReturn;
};
