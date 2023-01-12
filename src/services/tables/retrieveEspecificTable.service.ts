import { Table } from "./../../entities/table.entity";
import AppDataSource from "../../data-source";

export const retrieveEspecificTableService = async (tableId) => {
  const tableRepository = AppDataSource.getRepository(Table);

  const table = await tableRepository.findOneBy({
    id: tableId,
  });

  return table;
};
