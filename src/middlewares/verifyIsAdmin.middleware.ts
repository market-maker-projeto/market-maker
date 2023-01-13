import { Request, Response, NextFunction } from 'express'
import 'dotenv/config'
import { AppError } from './../errors/AppError';

export const verifyAdminMiddleware =  async(req: Request, res: Response, next: NextFunction) => {
    let foundUser = req.user
    if(!foundUser.isAdm){
         throw new AppError("User is not an administrator", 403)
    }
    return next()
}