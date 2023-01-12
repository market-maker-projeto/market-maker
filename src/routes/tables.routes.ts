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
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  createTableController
);
tablesRoutes.get(
  "",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  retrieveTablesController
);
tablesRoutes.get(
  "/:id",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  retrieveEspecificTableController
);
tablesRoutes.get(
  "/:id/orders",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  retrieveOrdersFromTableController
);
tablesRoutes.patch(
  "/:id",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  updateTableController
);
tablesRoutes.delete(
  "/:id",
  verifyTokenMiddleware,
  verifyAdminMiddleware,
  deleteTableController
);
