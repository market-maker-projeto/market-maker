import { Request, Response } from "express";
import { createOrderService } from "../services/orders/createOrder.service";

export const createOrderController = async (req: Request, res: Response) => {
  const order = req.body;
  const orderResponse = await createOrderService(order);

  return res.status(201).json(orderResponse);
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
