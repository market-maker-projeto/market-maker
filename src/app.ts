import "express-async-errors";
import "reflect-metadata";
import express from "express";
import "dotenv/config";
import userRoute from "./routes/users.routes";

const app = express();
app.use(express.json());

app.use("/users", userRoute);

export default app;
