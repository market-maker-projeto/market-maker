import { AppError } from "./../../errors/AppError";
import { Table } from "./../../entities/table.entity";
import { ITable } from "./../../interfaces/tables.interface";
import AppDataSource from "../../data-source";

export const createTableService = async (data: ITable): Promise<Table> => {
  const tableRepository = AppDataSource.getRepository(Table);

  const tableAlreadyExist = await tableRepository.findOneBy({
    table_number: data.table_number,
  });

  if (
    (data.isActive = null || data.seats == null || data.table_number == null)
  ) {
    throw new AppError("Invalid Table", 400);
  }

  if (tableAlreadyExist) {
    throw new AppError("Table already exist", 409);
  }

  const newTable = tableRepository.create(data);
  await tableRepository.save(newTable);

  return newTable;
};
