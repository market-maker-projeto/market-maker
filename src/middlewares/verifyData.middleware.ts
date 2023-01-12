
import { Request, Response, NextFunction } from 'express'
import { AnySchema } from 'yup'
import { AppError } from '../errors/AppError'

export const verifyDataMiddleware = (schema: AnySchema) => async(req: Request, res: Response, next: NextFunction) => {

    try {

        const validatedData = await schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })
        req.body = validatedData
        return next()
        
    } catch (error) {
        console.log(error.errors[0])
        throw new AppError(error.errors[0], 400)
    }

}