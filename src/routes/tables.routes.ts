import {
  createTableController,
  retrieveTablesController,
  retrieveEspecificTableController,
  retrieveOrdersFromTableController,
  updateTableController,
  deleteTableController,
} from "./../controllers/tables.controllers";
import { Router } from "express";

export const tablesRoutes = Router();

tablesRoutes.post("", createTableController);
tablesRoutes.get("", retrieveTablesController);
tablesRoutes.get("/:id", retrieveEspecificTableController);
tablesRoutes.get("/:id/orders", retrieveOrdersFromTableController);
tablesRoutes.patch("/:id", updateTableController);
tablesRoutes.delete("/:id", deleteTableController);
