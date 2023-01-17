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
tablesRoutes.get(
  "",
    retrieveTablesController
);
tablesRoutes.get(
  "/:id",
    retrieveEspecificTableController
);
tablesRoutes.get(
  "/:id/orders",
    retrieveOrdersFromTableController
);
tablesRoutes.patch(
  "/:id",
    updateTableController
);
tablesRoutes.delete(
  "/:id",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  deleteTableController
);
