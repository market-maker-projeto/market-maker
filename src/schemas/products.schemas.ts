import * as yup from "yup";
import { SchemaOf } from "yup";
import {
  IProduct,
  IProductRequestCategory,
} from "../interfaces/products.interface";

export const productsSchema: SchemaOf<IProduct> = yup.object().shape({
  name: yup.string().required(),
  category: yup.string().required(),
  price: yup.string().required(),
  in_stock: yup.boolean().required(),
});

export const listAllProductSchema: SchemaOf<IProductRequestCategory> = yup
  .object()
  .shape({
    id: yup.string().notRequired(),
    name: yup.string().notRequired(),
    category: yup
      .object({
        id: yup.string().notRequired(),
        name: yup.string().notRequired(),
      })
      .notRequired(),
    price: yup.string().notRequired(),
    in_stock: yup.boolean().notRequired(),
  });

export const listAllProductSchemaArray: SchemaOf<IProductRequestCategory[]> =
  yup.array(listAllProductSchema);
