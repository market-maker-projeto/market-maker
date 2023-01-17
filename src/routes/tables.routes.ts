import { tableSerializer } from "./../schemas/tables.schemas";
import { verifyDataMiddleware } from "./../middlewares/verifyData.middleware";
import { verifyAdminMiddleware } from "./../middlewares/verifyIsAdmin.middleware";
import {
  createTableController,
  retrieveTablesController,
  retrieveEspecificTableController,
  retrieveOrdersFromTableController,
  updateTableController,
  deleteTableController,
} from "./../controllers/tables.controllers";
import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware";

export const tablesRoutes = Router();

tablesRoutes.post(
  "",
  verifyDataMiddleware(tableSerializer),
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  createTableController
);
tablesRoutes.get("", verifyTokenMiddleware, retrieveTablesController);
tablesRoutes.get(
  "/:id",
  verifyTokenMiddleware,
  retrieveEspecificTableController
);
tablesRoutes.get(
  "/:id/orders",
  verifyTokenMiddleware,
  retrieveOrdersFromTableController
);
tablesRoutes.patch("/:id", verifyTokenMiddleware, updateTableController);
tablesRoutes.delete(
  "/:id",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  deleteTableController
);
