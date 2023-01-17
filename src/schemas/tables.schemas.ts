import { ItableRequest, ITableToOrder } from "./../interfaces/tables.interface";
import * as yup from "yup";

export const tableSerializer: yup.SchemaOf<ItableRequest> = yup.object().shape({
  seats: yup.number().required(),
  isActive: yup.boolean().required(),
  table_number: yup.number().required(),
});

export const retrieveTableAndOrdersSerializer: yup.SchemaOf<any> = yup
  .object()
  .shape({
    id: yup.string().required(),
    seats: yup.number().required(),
    isActive: yup.boolean().required(),
    table_number: yup.number().required(),
    orders: yup
      .array(
        yup
          .object({
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
            productsToOrder: yup.array(
              yup
                .object({
                  id: yup.string().required(),
                  product: yup
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
                    .notRequired(),
                })
                .required()
            ),
          })
          .required()
      )
      .required(),
  });
