import { Request, Response } from "express";
import { createOrderService } from "../services/orders/createOrder.service";
import { deleteOrderService } from "../services/orders/deleteOrder.service";
import { retrieveClosedOrdersService } from "../services/orders/retrieveClosedOrders.service";
import { retrieveEspecificOrderService } from "../services/orders/retrieveEspecificOrder.service";
import { retrieveOrdersService } from "../services/orders/retrieveOrders.service";

export const createOrderController = async (req: Request, res: Response) => {
  const order = req.body;

  const orderResponse = await createOrderService(order);

  return res.status(201).json(orderResponse);
};

export const retrieveOrdersController = async (req: Request, res: Response) => {
  const ordersResponse = await retrieveOrdersService();

  return res.status(200).json(ordersResponse);
};

export const retrieveEspecificOrderController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const orderResponse = await retrieveEspecificOrderService(id);

  return res.status(200).json(orderResponse);
};

export const retrieveClosedOrdersController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const ordersDeletedResponse = await retrieveClosedOrdersService(id);

  return res.status(200).json(ordersDeletedResponse);
};

export const deleteOrderController = async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteOrderService(id);

  return res.status(204).json({});
};
