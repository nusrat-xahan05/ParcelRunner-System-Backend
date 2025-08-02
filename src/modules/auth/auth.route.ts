import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginZodSchema, resetPasswordZodSchema } from "./auth.validation";


const router = Router()

// USER LOGIN ------
router.post('/login', validateRequest(loginZodSchema), AuthControllers.credentialsLogin);

// CREATE ACCESSTOKEN FROM REFRESH TOKEN ------
router.post('/refresh-token', checkAuth(...Object.values(Role)), AuthControllers.getNewAccessToken);

// USER LOGOUT ------
router.post('/logout', AuthControllers.logout);

// USER PASSWORD RESET ------
router.post('/reset-password', validateRequest(resetPasswordZodSchema), checkAuth(...Object.values(Role)), AuthControllers.resetPassword);


export const AuthRoutes = router;