import { retrieveOrdersFromTableService } from "./../services/tables/retrieveOrdersFromATable.service";
import { updateTableService } from "./../services/tables/updateTable.service";
import { retrieveEspecificTableService } from "./../services/tables/retrieveEspecificTable.service";
import { retrieveTablesService } from "./../services/tables/retrieveTables.service";
import { ITable } from "./../interfaces/tables.interface";
import { createTableService } from "./../services/tables/createTable.service";
import { Request, Response } from "express";
import { deleteTableService } from "../services/tables/deleteTable.service";

export const createTableController = async (req: Request, res: Response) => {
  const tableData: ITable = req.body;

  const newTable = await createTableService(tableData);
  return res.status(201).json(newTable);
};

export const retrieveTablesController = async (req: Request, res: Response) => {
  const tables = await retrieveTablesService();
  return res.status(200).json(tables);
};

export const retrieveEspecificTableController = async (
  req: Request,
  res: Response
) => {
  const table = await retrieveEspecificTableService(req.params.id);
  return res.status(200).json(table);
};

export const retrieveOrdersFromTableController = async (
  req: Request,
  res: Response
) => {
  const ordersFromTable = await retrieveOrdersFromTableService(req.params.id);
  return res.status(200).json(ordersFromTable);
};

export const updateTableController = async (req: Request, res: Response) => {
  const updateTable = await updateTableService(req.body, req.params.id);
  return res.status(200).json(updateTable);
};

export const deleteTableController = async (req: Request, res: Response) => {
  const deleteTable = await deleteTableService(req.params.id);
  return res.status(204).json();
};
