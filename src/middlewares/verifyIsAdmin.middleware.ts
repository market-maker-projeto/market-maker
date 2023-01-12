import { Request, Response, NextFunction } from 'express'
import 'dotenv/config'
import { AppError } from './../errors/AppError';

export const verifyAdminMiddleware =  async(req: Request, res: Response, next: NextFunction) => {
    let foundUser = req.user
    console.log(req.user)
    if(foundUser.isAdm === false){
         throw new AppError("User is not an administrator", 403)
    }
    return next()
}