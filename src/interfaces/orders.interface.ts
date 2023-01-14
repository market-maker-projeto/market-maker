export interface IOrderRequest {
  user_id: string;
  table_id: string;
  client_name?: string;
  products: [{ id: string }];
}

export interface iOrder extends IOrderRequest {
  id: string;
  createdAt: string;
  deletedAt?: string;
}
