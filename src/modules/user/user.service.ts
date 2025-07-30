import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { JwtPayload } from "jsonwebtoken";


// USER REGISTRATION ------ 
const createUser = async (payload: Partial<IUser>) => {
    const { email, password, role, ...rest } = payload;

    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist with This Email");
    }
    if (role === Role.ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can Only Register as 'SENDER' or 'RECEIVER'");
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

    const user = await User.create({
        email,
        password: hashedPassword,
        role,
        ...rest
    })
    return user
}

// GET ALL USERS ------ 
const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
}

// GET CURRENT USER ------ 
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

// GET SINGLE USER ------ 
const getSingleUser = async (id: string) => {
    const isUserExist = await User.findById(id).select("-password");
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No User Exist With This Id");
    }

    return {
        data: isUserExist
    }
};

// USER PROFILE UPDATE, BLOCK CAN BE DONE BY ADMIN ------
const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const isUserExist = await User.findById(userId);
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "No User Exist With This Id");
    }

    if ((decodedToken.userId !== userId) && (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER)) {
        throw new AppError(httpStatus.BAD_REQUEST, "You're not Authorized to Change Others Profile");
    }

    if (payload.role || payload.userStatus || payload.isVerified) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You're Not Authorized To Change Role, Status & Verification");
        }
    }

    if (payload.password) {
        // payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND);
        throw new AppError(httpStatus.BAD_REQUEST, "Change the Password From Reset Password");
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdateUser;
}




export const UserServices = {
    createUser, getAllUsers, getMe, getSingleUser, updateUser
}