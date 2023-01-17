export interface IUser {
  name: string;
  isAdm: boolean;
  username: string;
  password: string;
}

export interface IUserLogin {
  username: string;
  password: string;
}
export interface IUserReturn {
  username: string;
  isAdm: boolean;
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IUserUpdate {
  isAdm?: boolean;
  username?: string;
  name?: string;
  password?: string;
}
