import { IUser, UserStatus } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"
import AppError from "../../errorHelpers/appError";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";


// USER LOGIN ------
const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Email Does Not Exist");
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
    }

    if(isUserExist.userStatus === UserStatus.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, "Your Account Has Been Blocked")
    }

    const userTokens = createUserTokens(isUserExist);
    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}

// CREATE ACCESSTOKEN FROM REFRESH TOKEN ------
const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}

// USER PASSWORD RESET ------
const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);
    const isOldPasswordMatched = await bcryptjs.compare(oldPassword, user!.password as string);

    if(!isOldPasswordMatched){
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password Incorrect");
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
    user!.save();
}

export const AuthServices = {
    credentialsLogin, getNewAccessToken, resetPassword
}