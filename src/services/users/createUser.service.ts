import { IUser, IUserReturn } from './../../interfaces/users.interfaces';
import AppDataSource from '../../data-source'
import { User } from '../../entities/user.entity';
import { userWithoutPasswordSerializer } from '../../schemas/users.schemas';
export const createUserService = async (userData: IUser): Promise<IUserReturn> => {
    // console.log(userData)
    const userRepository = AppDataSource.getRepository(User)
    // console.log(userRepository)
    const createUser = userRepository.create(userData)

    await userRepository.save(createUser)
    console.log(createUser)
    const userReturnWithoutPass = await userWithoutPasswordSerializer.validate(createUser,{
        stripUnknown: true
    }) 
    return userReturnWithoutPass
};
