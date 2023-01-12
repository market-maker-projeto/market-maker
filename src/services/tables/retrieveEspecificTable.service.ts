import { AppError } from "./../../errors/AppError";
import { Table } from "./../../entities/table.entity";
import AppDataSource from "../../data-source";

export const retrieveEspecificTableService = async (tableId) => {
  const tableRepository = AppDataSource.getRepository(Table);

  const table = await tableRepository.findOneBy({
    id: tableId,
  });

  if (!table) {
    throw new AppError("Table not exist", 404);
  }

  return table;
};
