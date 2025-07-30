import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { setAuthCookie } from "../../utils/setCookie";


// USER LOGIN ------
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body)

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged In Successfully",
        data: loginInfo
    })
})

// CREATE ACCESSTOKEN FROM REFRESH TOKEN ------
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token Received");
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Tokens Retrived Successfully",
        data: tokenInfo,
    })
})

// USER LOGOUT ------
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged Out Successfully",
        data: null,
    })
})

// USER PASSWORD RESET ------
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Changed Successfully",
        data: null,
    })
})


export const AuthControllers = {
    credentialsLogin, getNewAccessToken, logout, resetPassword
}