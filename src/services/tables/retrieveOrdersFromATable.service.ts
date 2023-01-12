import { AppError } from "./../../errors/AppError";
import { Table } from "./../../entities/table.entity";
import AppDataSource from "../../data-source";

export const retrieveOrdersFromTableService = async (
  tableId
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
      orders: true,
    },
  });

  return orders;
};
