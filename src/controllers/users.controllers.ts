import { Request, Response } from "express";

export const createUserController = async (req: Request, res: Response) => {
  return res.status(201).json();
};

export const retrieveUsersController = async (req: Request, res: Response) => {
  return res.status(200).json();
};

export const retrieveEspecificUserController = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json();
};

export const updateUserController = async (req: Request, res: Response) => {
  return res.status(200).json();
};

export const deleteUserController = async (req: Request, res: Response) => {
  return res.status(204).json();
};
