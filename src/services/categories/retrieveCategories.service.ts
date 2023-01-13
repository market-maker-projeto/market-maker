import { IMockedCategory } from "../../interfaces/categories.interface";
import AppDataSource from "../../data-source";
import { Category } from "../../entities/category.entity";

export const retrieveCategoriesService = async (): Promise<
  IMockedCategory[]
> => {
  const categoryRepository = AppDataSource.getRepository(Category);

  const listCategory = await categoryRepository.find();
  
  return listCategory;
};
