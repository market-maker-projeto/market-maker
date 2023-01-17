import AppDataSource from "../../data-source";
import { Category } from "../../entities/category.entity";
import { Product } from "../../entities/product.entity";
import { IProductRequestCategory } from "../../interfaces/products.interface";
import { listAllProductSchemaArray } from "../../schemas/products.schemas";

export const listAllProductCategoryService = async (
  idCategory: string
): Promise<IProductRequestCategory[]> => {
  const productRepository = AppDataSource.getRepository(Product);

  const listAllProduct = await productRepository.find({
    where: {
      category: { id: idCategory },
    },
  });

  const categoryReturn = await listAllProductSchemaArray.validate(
    listAllProduct,
    {
      stripUnknown: true,
    }
  );

  return categoryReturn;
};
