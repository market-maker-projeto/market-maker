import dataSource from "../../data-source";
import { Category } from "../../entities/category.entity";
import { ProductsToOrder } from "../../entities/producstToOrder.entity";
import { Product } from "../../entities/product.entity";
import { AppError } from "../../errors/AppError";
import {
  IProduct,
  IProductRequest,
  IProductResponse,
} from "../../interfaces/products.interface";

export const createProductService = async (productData: IProductRequest) => {
  const productRepo = dataSource.getRepository(Product);
  const categoryRepo = dataSource.getRepository(Category);

  const category = await categoryRepo.findOneBy({
    name: productData.category.name,
  });

  const product = await productRepo.findOneBy({
    name: productData.name,
  });

  if (product) {
    throw new AppError("Product already exists", 409);
  }

  if (
    productData.price == "" ||
    productData.name == "" ||
    productData.category == null
  ) {
    throw new AppError("Invalid product", 400);
  }

  const newProduct = productRepo.create({
    ...productData,
    category: category,
  });

  await productRepo.save(newProduct);

  return newProduct;
};
