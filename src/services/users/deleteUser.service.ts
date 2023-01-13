import { AppError } from "../../errors/AppError";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { IUserReturn } from "../../interfaces/users.interfaces";

export const deleteUserService = async (userId:string) => {
if(!userId) throw new AppError("Id inválido", 404)

const userRepository = AppDataSource.getRepository(User);
  const user:IUserReturn = await userRepository.findOneBy({ id: userId });
  if(!user){
    throw new AppError("User not found", 404);
  }
  await userRepository
  .createQueryBuilder()
  .softDelete()
  .where("id = :id", { id: userId })
  .execute();


const userReturn = await userRepository.findOne({where:{ id: userId},  withDeleted: true });

  return userReturn

};
