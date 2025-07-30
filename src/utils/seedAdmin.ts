import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env"
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs"

export const seedAdmin = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const isAdminExist = await User.findOne({email: envVars.ADMIN_EMAIL});
        if(isAdminExist){
            console.log("Admin Already Exist");
            return;
        }

        const hashedPassword = await bcryptjs.hash(envVars.ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));

        const payload: IUser = {
            name: "Admin",
            role: Role.ADMIN,
            email: envVars.ADMIN_EMAIL,
            password: hashedPassword,
            phone: envVars.ADMIN_PHONE,
            isVerified: true
        }

        await User.create(payload);
    }catch(err){
        console.log(err);
        next(err);
    }
}