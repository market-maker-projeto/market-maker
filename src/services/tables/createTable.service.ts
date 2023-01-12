import { AppError } from "./../../errors/AppError";
import { Table } from "./../../entities/table.entity";
import { ITable } from "./../../interfaces/tables.interface";
import AppDataSource from "../../data-source";

export const createTableService = async (data: ITable) => {
  const tableRepository = AppDataSource.getRepository(Table);

  const tableAlreadyExist = tableRepository.findOneBy({
    table_number: data.table_number,
  });

  if (tableAlreadyExist) {
    throw new AppError("Table already exist", 409);
  }

  const newTable = tableRepository.create(data);
  await tableRepository.save(newTable);

  return newTable;
};
