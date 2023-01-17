import * as yup from "yup";
import { SchemaOf } from "yup";
import { IProductRequestCategory } from "../interfaces/products.interface";

export const productsSchema: SchemaOf<IProductRequestCategory> = yup
  .object()
  .shape({
    name: yup.string().required(),
    category: yup.string().required(),
    price: yup.string().required(),
    in_stock: yup.boolean().required(),
  });

export const listAllProdutSchema: SchemaOf<IProductRequestCategory> = yup
  .object()
  .shape({
    name: yup.string().required(),
    category: yup
      .object({
        id: yup.string(),
        name: yup.string(),
      })
      .required(),
    price: yup.string().required(),
    in_stock: yup.boolean().required(),
  });
