import { IUserUpdate, IUserReturn } from "./../../interfaces/users.interfaces";
import { AppError } from "../../errors/AppError";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { userWithoutPasswordSerializer } from "../../schemas/users.schemas";
import { hashSync } from "bcryptjs";


export const updateUserService = async (
  userData: IUserUpdate,
  userId: string
): Promise<IUserReturn> => {
  if (!userData) {
    throw new AppError("Missing Params", 401);
  }
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: userId });
  if(!user){
    throw new AppError("User not found", 404);
  }

  
  if (userData?.password) {
    userData.password = hashSync(userData.password, 10);
  }
  const newObj = {
    ...user,
    ...userData,
  };

  await userRepository.save(newObj);
  const validatedUser = await userWithoutPasswordSerializer.validate(newObj, { stripUnknown: true})

  return validatedUser
};
