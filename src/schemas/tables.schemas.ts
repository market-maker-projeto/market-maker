import { ItableRequest } from "./../interfaces/tables.interface";
import * as yup from "yup";

export const tableSerializer: yup.SchemaOf<ItableRequest> = yup.object().shape({
  seats: yup.number().required(),
  isActive: yup.boolean().required(),
  table_number: yup.number().required(),
});
