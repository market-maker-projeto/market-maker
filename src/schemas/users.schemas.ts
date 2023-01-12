import { IUser, IUserReturn } from './../interfaces/users.interfaces';
import * as yup from 'yup'



export const userSerializer: yup.SchemaOf<IUser> = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
    isAdm: yup.boolean().required()
})

export const userWithoutPasswordSerializer:yup.SchemaOf<IUserReturn> = yup.object().shape({
    username: yup.string().notRequired(),
    isAdm: yup.boolean().notRequired(),
    id: yup.string().notRequired()
})