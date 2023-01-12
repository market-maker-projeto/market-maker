import { AppError } from "./../../errors/AppError";
import { Table } from "./../../entities/table.entity";
import AppDataSource from "../../data-source";

export const deleteTableService = async (tableId): Promise<{}> => {
  const tableRepository = AppDataSource.getRepository(Table);

  const findTable = tableRepository.findOneBy({
    id: tableId,
  });

  if (!findTable) {
    throw new AppError("Table not exist", 404);
  }

  const tableDelete = await tableRepository.delete({
    id: tableId,
  });

  return {};
};
