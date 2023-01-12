export interface IUser {
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
  id: string;
}