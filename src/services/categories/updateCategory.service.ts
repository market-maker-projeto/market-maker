import {
  ICategory,
  IMockedCategory,
} from "../../interfaces/categories.interface";
import AppDataSource from "../../data-source";
import { Category } from "../../entities/category.entity";
import { AppError } from "../../errors/AppError";

export const updateCategoryService = async (
  idCategory: string,
  body: ICategory
): Promise<IMockedCategory> => {
  const categoryRepository = AppDataSource.getRepository(Category);

  const foundCategory = await categoryRepository.findOneBy({ id: idCategory });

  if (!foundCategory) {
    throw new AppError(
      `It should not be possible to update a category that does not exist`,
      409
    );
  }

  const updatedCategory = categoryRepository.create({
    ...foundCategory,
    ...body,
  });

  await categoryRepository.save(updatedCategory);

  return updatedCategory;
};
