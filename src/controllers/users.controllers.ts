//import { updateUserService } from './../services/users/updateUser.service';
import { retrieveEspecificUserService } from './../services/users/retrieveEspecificUser.service';
import { retrieveUsersService } from './../services/users/retrieveUsers.service';
import { Request, Response } from "express";
import { createUserService } from "../services/users/createUser.service";
import { updateUserService } from '../services/users/updateUser.service';
import { IUserUpdate } from '../interfaces/users.interfaces';
import { deleteUserService } from '../services/users/deleteUser.service';

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
  const userData:IUserUpdate = req.body
  const updatedUser = await updateUserService(userData, userId)
  return res.status(200).json(updatedUser);
};

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = req.params.id
  const softDeleted = await deleteUserService(userId)
  return res.status(204).json(softDeleted);
};
