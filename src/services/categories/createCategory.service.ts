import AppDataSource from "../../data-source";
import { Category } from "../../entities/category.entity";
import { AppError } from "../../errors/AppError";
import {
  ICategory,
  ICategoryResponse,
  IMockedCategory,
} from "../../interfaces/categories.interface";

export const createCategoryService = async (
  body: ICategory
): Promise<IMockedCategory> => {
  const { name } = body;

  const categoryRepository = AppDataSource.getRepository(Category);

  const foundCategory = await categoryRepository.findOneBy({ name });

  if (foundCategory) {
    throw new AppError(
      `It should not be possible to create an existing category`,
      409
    );
  }

  const category = categoryRepository.create(body);

  await categoryRepository.save(category);

  return category;
};
