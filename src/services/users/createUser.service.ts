import { AppError } from './../../errors/AppError';
import { IUser, IUserReturn } from './../../interfaces/users.interfaces';
import AppDataSource from '../../data-source'
import { User } from '../../entities/user.entity';
import { userWithoutPasswordSerializer } from '../../schemas/users.schemas';
export const createUserService = async (userData: IUser): Promise<IUserReturn> => {

    const userRepository = AppDataSource.getRepository(User)
    const verifyUser = await userRepository.findOneBy({username: userData.username})
    if(verifyUser) {
        throw new AppError ("User already exists", 409)
    }
    const createUser = userRepository.create(userData)

    await userRepository.save(createUser)

    const userReturnWithoutPass = await userWithoutPasswordSerializer.validate(createUser,{
        stripUnknown: true
    }) 
    return userReturnWithoutPass
};
