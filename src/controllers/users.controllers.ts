import { Request, Response } from "express";
import { createUserService } from "../services/users/createUser.service";

export const createUserController = async (req: Request, res: Response) => {
  const userData = req.body
  const user = await createUserService(userData)
  console.log(user)
  return res.status(201).json(user);
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
