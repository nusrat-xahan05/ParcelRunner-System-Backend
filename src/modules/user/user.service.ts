import { AgentStatus, IAgentRequest, IUser, Role } from "./user.interface";
import { AgentRequest, User } from "./user.model";
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
    if ((role !== Role.SENDER) && (role !== Role.RECEIVER)) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can Only Register as 'SENDER' or 'RECEIVER'");
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));
    const user = await User.create({
        email,
        password: hashedPassword,
        role,
        ...rest
    })

    return user;
}

// USER AGENT REQUEST ------
const createAgentRequest = async (decodedToken: JwtPayload) => {
    const isRequestExist = await AgentRequest.findOne({ userId: decodedToken.userId });
    if (isRequestExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "You Have Already Made A Request");
    }

    const isUserExist = await User.findById(decodedToken.userId);
    if(isUserExist){
        isUserExist.agentStatus! = AgentStatus.PENDING;
        await isUserExist.save();
    }

    const result = await AgentRequest.create({ userId: decodedToken.userId });
    return result;
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

// GET ALL AGENT REQUEST ------
const GetAllAgentRequest = async (query: Record<string, string>) => {
    const filter = query;
    const requests = await AgentRequest.find(filter).populate('userId');
    const totalRequest = await AgentRequest.countDocuments();

    return {
        data: requests,
        meta: {
            total: totalRequest
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

    if ((decodedToken.userId !== userId) && (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER || decodedToken.role === Role.AGENT)) {
        throw new AppError(httpStatus.BAD_REQUEST, "You're not Authorized to Change Others Profile");
    }

    if (payload.role || payload.userStatus || payload.agentStatus) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You're Not Authorized To Change Role, Status & Verification");
        }
    }

    if (payload.password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Change the Password From Reset Password");
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdateUser;
}

// REVIEW AGENT REQUEST ------
const reviewAgentRequest = async (requestId: string, payload: Partial<IAgentRequest>, decodedToken: JwtPayload) => {
    const isRequestExist = await AgentRequest.findById(requestId);
    if (!isRequestExist) {
        throw new AppError(httpStatus.NOT_FOUND, "No Request Exist With This Id");
    }
    if (isRequestExist.agentStatus === payload.agentStatus) {
        throw new AppError(httpStatus.NOT_FOUND, `Agent Status is Already In ${isRequestExist.agentStatus}`);
    }

    isRequestExist.agentStatus = payload.agentStatus!;
    isRequestExist.reviewedBy = decodedToken.userId;
    await isRequestExist.save();

    if (payload.agentStatus === AgentStatus.APPROVED) {
        await User.findByIdAndUpdate(isRequestExist.userId, { role: Role.AGENT, agentStatus: payload.agentStatus });
    }
    if (payload.agentStatus === AgentStatus.REJECTED) {
        await User.findByIdAndUpdate(isRequestExist.userId, { agentStatus: payload.agentStatus });
    }

    return isRequestExist;
}


export const UserServices = {
    createUser, createAgentRequest, GetAllAgentRequest, getAllUsers, getMe, getSingleUser, updateUser, reviewAgentRequest
}