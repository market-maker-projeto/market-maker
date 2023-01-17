import {
  IUser,
  IUserLogin,
  IUserReturn,
} from "../../interfaces/users.interfaces";

export const mockedUser: IUser = {
  name: "usuario",
  isAdm: false,
  username: "user",
  password: "123456",
};
export const mockedUserReturn: IUserReturn = {
  isAdm: false,
  username: "user",
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const mockedAdmin: IUser = {
  name: "admin",
  isAdm: true,
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
