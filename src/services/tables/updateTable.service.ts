import { ITable } from "./../../interfaces/tables.interface";
import { AppError } from "./../../errors/AppError";
import { Table } from "./../../entities/table.entity";
import AppDataSource from "../../data-source";

export const updateTableService = async (
  data: ITable,
  tableId: string
): Promise<Table> => {
  const tableRepository = AppDataSource.getRepository(Table);

  const findTable = await tableRepository.findOne({
    where: {
      id: tableId,
    },
  });

  console.log(findTable);

  if (!findTable) {
    throw new AppError("table not exist", 404);
  }

  const updateTable = tableRepository.create({
    ...findTable,
    ...data,
  });

  await tableRepository.save(updateTable);

  return updateTable;
};
