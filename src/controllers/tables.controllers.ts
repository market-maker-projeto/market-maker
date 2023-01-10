import { Request, Response } from "express";

export const createTableController = async (req: Request, res: Response) => {
  return res.status(201).json();
};

export const retrieveTablesController = async (req: Request, res: Response) => {
  return res.status(200).json();
};

export const retrieveEspecificTableController = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json();
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
