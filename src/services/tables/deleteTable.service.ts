import { Table } from "./../../entities/table.entity";
import AppDataSource from "../../data-source";

export const deleteTableService = async (tableId) => {
  const tableRepository = AppDataSource.getRepository(Table);

  const tableDelete = await tableRepository.delete({
    id: tableId,
  });

  return {};
};
