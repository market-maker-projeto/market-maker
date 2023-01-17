import { retrieveTableAndOrdersSerializer } from "./../../schemas/tables.schemas";
import { AppError } from "./../../errors/AppError";
import { Table } from "./../../entities/table.entity";
import AppDataSource from "../../data-source";

export const retrieveOrdersFromTableService = async (
  tableId: string
): Promise<Table> => {
  const tableRepository = AppDataSource.getRepository(Table);

  const tableExist = await tableRepository.findOneBy({
    id: tableId,
  });

  if (!tableExist) {
    throw new AppError("table not exist", 404);
  }

  const orders = await tableRepository.findOne({
    where: {
      id: tableId,
    },
    relations: {
      orders: { user: true, productsToOrder: { product: true } },
    },
  });

  delete Object.assign(orders, {
    ["products"]: orders["productsToOrder"],
  })["productsToOrder"];

  const ordersResponse = await retrieveTableAndOrdersSerializer.validate(
    orders,
    {
      stripUnknown: true,
    }
  );

  return ordersResponse;
};
