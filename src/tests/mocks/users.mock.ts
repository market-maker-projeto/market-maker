import { IUserLogin } from "./../../interfaces/users.interfaces";
import { IUser } from "../../interfaces/users.interfaces";

export const createUserValid: IUser = {
  isAdmin: false,
  username: "testename",
  password: "testepassword",
};

export const mockedAdmin: IUser = {
  isAdmin: true,
  username: "admin",
  password: "123456",
};

export const mockedUserLogin: IUserLogin = {
  username: "user",
  password: "123456",
};

export const mockedAdminLogin: IUserLogin = {
  username: "admin",
  password: "123456",
};
