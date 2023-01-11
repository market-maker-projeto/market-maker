export interface iOrderRequest {
  user_id: string;
  table_id: string;
  client_name?: string;
}

export interface iOrder extends iOrderRequest {
  id: string;
  createdAt: string;
  deletedAt?: string;
}
