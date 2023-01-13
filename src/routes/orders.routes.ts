import {
  createOrderController,
  retrieveOrdersController,
  retrieveClosedOrdersController,
  retrieveEspecificOrderController,
  deleteOrderController,
} from "./../controllers/orders.controllers";
import { Router } from "express";

export const orderRoutes = Router();

orderRoutes.post("", createOrderController);
orderRoutes.get("", retrieveOrdersController);
orderRoutes.get("/:id", retrieveEspecificOrderController);
orderRoutes.get("/deleted", retrieveClosedOrdersController);
orderRoutes.delete("/:id"), deleteOrderController;
