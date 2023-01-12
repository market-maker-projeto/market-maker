import { retrieveEspecificTableService } from "./../services/tables/retrieveEspecificTable.service";
import { retrieveTablesService } from "./../services/tables/retrieveTables.service";
import { ITable } from "./../interfaces/tables.interface";
import { createTableService } from "./../services/tables/createTable.service";
import { Request, Response } from "express";

export const createTableController = async (req: Request, res: Response) => {
  const tableData: ITable = req.body;

  const newTable = createTableService(tableData);
  return res.status(201).json(newTable);
};

export const retrieveTablesController = async (req: Request, res: Response) => {
  const tables = retrieveTablesService();
  return res.status(200).json(tables);
};

export const retrieveEspecificTableController = async (
  req: Request,
  res: Response
) => {
  const table = retrieveEspecificTableService(req.params);
  return res.status(200).json(table);
};

export const retrieveOrdersFromTableController = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json();
};

export const updateTableController = async (req: Request, res: Response) => {
  return res.status(200).json();
};

export const deleteTableController = async (req: Request, res: Response) => {
  return res.status(204).json();
};
