import * as yup from "yup";
import { SchemaOf } from "yup";
import { IOrderRequest } from "../interfaces/orders.interface";

export const orderSchema: SchemaOf<IOrderRequest> = yup.object().shape({
  user_id: yup.string().required(),
  table_id: yup.string().required(),
  client_name: yup.string().notRequired(),
  products: yup.array(yup.object({ id: yup.string() })),
});

export const createOrderResponseSchema: yup.SchemaOf<any> = yup.object().shape({
  id: yup.string().required(),
  client_name: yup.string().required(),
  user: yup
    .object({
      name: yup.string().notRequired(),
      id: yup.string().notRequired(),
      username: yup.string().notRequired(),
      isAdm: yup.boolean().notRequired(),
    })
    .nullable()
    .notRequired(),

  table: yup.object({
    id: yup.string().required(),
    seats: yup.number().required(),
    isActive: yup.boolean().required(),
    table_number: yup.number().required(),
  }),

  products: yup.array(
    yup
      .object({
        id: yup.string().required(),
        name: yup.string().required(),
        price: yup.string().required(),
        in_stock: yup.boolean().required(),
        category: yup
          .object({
            id: yup.string().required(),
            name: yup.string().required(),
          })
          .required(),
      })
      .nullable()
      .notRequired()
  ),
});

export const retrieveOrderSchema = yup.object().shape({
  id: yup.string().notRequired(),
  client_name: yup.string().notRequired(),
  tabe: yup
    .object({
      id: yup.string().notRequired(),
      seats: yup.number().notRequired(),
      isActive: yup.boolean().notRequired(),
      table_number: yup.number().notRequired(),
    })
    .nullable(),
  user: yup
    .object({
      id: yup.string().notRequired(),
      name: yup.string().notRequired(),
      username: yup.string().notRequired(),
      isAdm: yup.boolean().notRequired(),
    })
    .nullable(),
  productsToOrder: yup.array(
    yup.object({
      id: yup.string().notRequired(),
      product: yup
        .object({
          id: yup.string().notRequired(),
          name: yup.string().notRequired(),
          price: yup.string().notRequired(),
          in_stock: yup.boolean().notRequired(),
          category: yup.object({
            id: yup.string().notRequired(),
            name: yup.string().notRequired(),
          }),
        })
        .nullable(),
    })
  ),
});

export const retrieveOrdersResponseSchema = yup.array(retrieveOrderSchema);
