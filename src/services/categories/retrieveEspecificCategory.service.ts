import { IMockedCategory } from "../../interfaces/categories.interface";
import AppDataSource from "../../data-source";
import { Category } from "../../entities/category.entity";

export const retrieveEspecificCategoryService = async (
  idCategory: string
): Promise<IMockedCategory> => {
  const categoryRepository = AppDataSource.getRepository(Category);

  const listSingleCategory = await categoryRepository.findOneBy({ id: idCategory });

  return listSingleCategory;
};
