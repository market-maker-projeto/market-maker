import { IOrderResponse } from "./orders.interface";
export interface ITable {
  id?: string;
  seats: number;
  isActive: boolean;
  table_number: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItableRequest {
  seats: number;
  isActive: boolean;
  table_number: number;
}

export interface ITableToOrder {
  id?: string;
  seats: number;
  isActive: boolean;
  table_number: number;
  createdAt?: string;
  updatedAt?: string;
  orders: IOrderResponse[];
}
