import { IMockedCategory } from "./categories.interface";
export interface IProduct {
  categoryId: string;
  name: string;
  price: number;
  in_stock: boolean;
}
export interface IProductResponse {
  categoryId: string;
  name: string;
  price: number;
  in_stock: boolean;
  id: string;
}

export interface IProductInvalid {
  categoryId: string;
  name: string;
  in_stock: boolean;
}
