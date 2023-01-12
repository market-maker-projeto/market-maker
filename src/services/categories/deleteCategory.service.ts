import AppDataSource from "../../data-source";
import { Category } from "../../entities/category.entity";
import { AppError } from "../../errors/AppError";
import { ICategory, IMockedCategory } from "../../interfaces/categories.interface";

export const deleteCategoryService = async (
  idCategory: string
): Promise<Object> => {
  const categoryRepository = AppDataSource.getRepository(Category);

  const foundCategory: IMockedCategory = await categoryRepository.findOneBy({ id: idCategory });

  if (!foundCategory) {
    throw new AppError(
      `It should not be possible to delete a category that does not exist`,
      404
    );
  }

  await categoryRepository.delete(foundCategory);

  return {};
};
