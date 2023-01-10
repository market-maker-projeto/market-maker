import { Request, Response } from "express";

export const createSessionController = async (req: Request, res: Response) => {
  return res.status(201).json();
};
