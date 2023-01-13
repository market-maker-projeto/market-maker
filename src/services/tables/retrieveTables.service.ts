import { Table } from "./../../entities/table.entity";
import AppDataSource from "../../data-source";

export const retrieveTablesService = async (): Promise<Table[]> => {
  const tableRepository = AppDataSource.getRepository(Table);

  const allTables = await tableRepository.find();

  return allTables;
};
