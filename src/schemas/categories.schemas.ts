import * as yup from "yup";
import { SchemaOf } from "yup";
import { ICategory } from "../interfaces/categories.interface";

export const categorySchema: SchemaOf<ICategory> = yup.object().shape({
  name: yup.string().required(),
});
