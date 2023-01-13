import { createSessionController } from "./../controllers/session.controllers";
import { Router } from "express";

export const sessionRoutes = Router();

sessionRoutes.post("", createSessionController);
