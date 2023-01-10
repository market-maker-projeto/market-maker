import { Request, Response } from "express";

export const createOrderController = async (req: Request, res: Response) => {
  return res.status(201).json();
};

export const retrieveOrdersController = async (req: Request, res: Response) => {
  return res.status(200).json();
};

export const retrieveEspecificOrderController = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json();
};

export const retrieveClosedOrdersController = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json();
};

export const deleteOrderController = async (req: Request, res: Response) => {
  return res.status(204).json();
};
