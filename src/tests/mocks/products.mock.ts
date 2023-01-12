import {
  IProduct,
  IProductInvalid,
  IProductResponse,
} from "./../../interfaces/products.interface";

export const mockedProduct: IProduct = {
  name: "Cerveja Long Neck",
  categoryId: "",
  price: 8.99,
  in_stock: true,
};
export const mockedProductResponse: IProductResponse = {
  name: "Cerveja Long neck",
  categoryId: "",
  price: 8.99,
  in_stock: true,
  id: "",
};
export const invalidProduct: IProductInvalid = {
  name: "",
  categoryId: "",
  in_stock: true,
};
