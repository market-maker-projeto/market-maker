import "express-async-errors";
import { tablesRoutes } from "./routes/tables.routes";
import { productsRoutes } from "./routes/products.routes";
import "reflect-metadata";
import express from "express";
import "dotenv/config";
import { sessionRoutes } from "./routes/session.routes";
import { orderRoutes } from "./routes/orders.routes";
import { userRoutes } from "./routes/users.routes";
import { categoriesRoutes } from "./routes/categories.routes";
import { errorHandler } from "./errors/errorHandler";

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/login", sessionRoutes);
app.use("/categories", categoriesRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productsRoutes);
app.use("/tables", tablesRoutes);

app.use(errorHandler);
export default app;
