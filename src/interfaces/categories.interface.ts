export interface ICategory {
  name: string;
}

export interface IMockedCategory {
  name: string;
  id: string;
}

export interface ICategoryResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
