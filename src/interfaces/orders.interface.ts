export interface IOrderRequest {
  user_id: string;
  table_id: string;
  client_name?: string;
  products: [{ id: string }];
}

export interface IOrderResponse {
  id: string;
  client_name: string;
  user: Object;
  table: Object;
  products: Array<{}>;
}
