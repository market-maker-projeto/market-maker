import * as yup from "yup";
import { SchemaOf } from "yup";
import { IOrderRequest } from "../interfaces/orders.interface";

export const orderSchema: SchemaOf<IOrderRequest> = yup.object().shape({
  user_id: yup.string().required(),
  table_id: yup.string().required(),
  client_name: yup.string().notRequired(),
  products: yup.array(yup.object({ id: yup.string() })),
});
