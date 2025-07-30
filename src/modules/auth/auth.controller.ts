import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
// import passport from "passport";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userToken";



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

// const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     passport.authenticate("local", async (err: any, user: any, info: any) => {
//         if (err) {
//             return next(new AppError(401, err));
//         }

//         if (!user) {
//             return next(new AppError(401, info.message));
//         }

//         const userTokens = await createUserTokens(user);
//         const { password: pass, ...rest } = user.toObject();

//         setAuthCookie(res, userTokens);

//         sendResponse(res, {
//             statusCode: httpStatus.OK,
//             success: true,
//             message: "User Logged In Successfully",
//             data: {
//                 accessToken: userTokens.accessToken,
//                 refreshToken: userTokens.refreshToken,
//                 user: rest
//             },
//         })
//     })(req, res, next);
// })


// const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     let rediredTo = req.query.state ? req.query.state as string : "";

//     if (rediredTo.startsWith("/")) {
//         rediredTo = rediredTo.slice(1)
//     }
//     const user = req.user;

//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
//     }

//     const tokenInfo = createUserTokens(user);

//     setAuthCookie(res, tokenInfo);

//     res.redirect(`${envVars.FRONTEND_URL}/${rediredTo}`);
// })

export const AuthControllers = {
    credentialsLogin, getNewAccessToken, logout, resetPassword,
    // googleCallbackController
}