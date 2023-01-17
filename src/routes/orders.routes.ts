import {
  createOrderController,
  retrieveOrdersController,
  retrieveClosedOrdersController,
  retrieveEspecificOrderController,
  deleteOrderController,
} from "./../controllers/orders.controllers";
import { Router } from "express";
import { verifyDataMiddleware } from "../middlewares/verifyData.middleware";
import { orderSchema } from "../schemas/orders.schemas";

export const orderRoutes = Router();

orderRoutes.post("", verifyDataMiddleware(orderSchema), createOrderController);
orderRoutes.get("", retrieveOrdersController);
orderRoutes.get("/:id", retrieveEspecificOrderController);
orderRoutes.get("/deleted/:id", retrieveClosedOrdersController);
orderRoutes.delete("/:id", deleteOrderController);
