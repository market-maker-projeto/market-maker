import { IOrderRequest } from "../../interfaces/orders.interface";

export const newOrder: IOrderRequest = {
  table_id: "user-uiid",
  user_id: "user-uuid",
  client_name: "cliente_1",
  products: [{ id: "1234" }],
};
