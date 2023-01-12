import { userWithoutPasswordSerializer } from './../../schemas/users.schemas';
import { IUserReturn } from './../../interfaces/users.interfaces';
import AppDataSource from '../../data-source'
import { User } from '../../entities/user.entity';
import { AppError } from '../../errors/AppError';
export const retrieveEspecificUserService = async (idUser: string): Promise<IUserReturn> => {
const userRepository = AppDataSource.getRepository(User)
const allUsers = await userRepository.findOneBy( { id: idUser })

if (!allUsers) {
    throw new AppError("user not found", 404)
}
const validatedUser = await userWithoutPasswordSerializer.validate(allUsers, { stripUnknown: true})

console.log(validatedUser)
return validatedUser
};
