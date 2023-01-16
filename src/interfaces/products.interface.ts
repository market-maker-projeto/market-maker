import { IMockedCategory } from "./categories.interface";
export interface IProduct {
  category: string;
  name?: string;
  price?: string;
  in_stock: boolean;
}
export interface IProductResponse {
  category: IMockedCategory;
  name: string;
  price: string;
  in_stock: boolean;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IProductInvalid {
  category: string;
  name: string;
  in_stock: boolean;
}

export interface IProductUpdate {
  name?: string;
  price?: string;
}

export interface IProductRequest {
  category: IMockedCategory;
  name: string;
  price: string;
  in_stock: boolean;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IProductRequestCategory {
  name: string;
  category: string;
  price: string;
  in_stock: boolean;
}
