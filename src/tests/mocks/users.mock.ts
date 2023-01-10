import { IUser, IUserLogin } from "../../interfaces/users.interfaces";

export const createUserValid: IUser = {
  isAdmin: false,
  username: "testename",
  password: "testepassword",
};

export const mockedUserLogin: IUserLogin = {
  username: "TesteName",
  password: "Test123",
};

export const mockedAdm: IUser = {
  isAdmin: true,
  username: "TesteName1",
  password: "Test456",
};

export const mockedAdmLogin: IUserLogin = {
  username: "SouAdminTest",
  password: "123456",
};
