//import { updateUserService } from './../services/users/updateUser.service';
import { retrieveEspecificUserService } from './../services/users/retrieveEspecificUser.service';
import { retrieveUsersService } from './../services/users/retrieveUsers.service';
import { Request, Response } from "express";
import { createUserService } from "../services/users/createUser.service";

export const createUserController = async (req: Request, res: Response) => {
  const userData = req.body
  const user = await createUserService(userData)
  return res.status(201).json(user);
};

export const retrieveUsersController = async (req: Request, res: Response) => {
  const users = await retrieveUsersService()
  return res.status(200).json(users);
};

export const retrieveEspecificUserController = async (
  req: Request,
  res: Response
) => {
  const userId = req.params.id
  const user = await retrieveEspecificUserService(userId)
  return res.status(200).json(user);
};

export const updateUserController = async (req: Request, res: Response) => {
  const userId = req.params.id
  const userData = req.body
  // const updatedUser = updateUserService(userData, userId)
  // return res.status(200).json(updatedUser);
};

export const deleteUserController = async (req: Request, res: Response) => {
  return res.status(204).json();
};
