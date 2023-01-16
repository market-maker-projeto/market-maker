import { ICategory } from "./../../interfaces/categories.interface";
import {
  IProduct,
  IProductInvalid,
  IProductResponse,
} from "./../../interfaces/products.interface";

export const mockedProduct: IProduct = {
  name: "Cerveja Long Neck",
  category: "Bebidas",
  price: "8.99",
  in_stock: true,
};
export const mockedProductResponse: IProductResponse = {
  name: "Cerveja Long neck",
  category: { name: "bebidas", id: "" },
  price: "8.99",
  in_stock: true,
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
export const invalidProduct: IProductInvalid = {
  name: "",
  category: "",
  in_stock: true,
};
