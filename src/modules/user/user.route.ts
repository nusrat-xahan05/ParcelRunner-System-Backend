import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router()

// USER REGISTRATION ------ (USER ENDPOINT)
router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser)

// GET ALL USERS ------ (ADMIN ENDPOINT)
router.get('/users', checkAuth(Role.ADMIN), UserControllers.getAllUsers)

// GET CURRENT USER ------ (USER ENDPOINT)
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)

// GET SINGLE USER ------ (ADMIN ENDPOINT)
router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser)

// USER PROFILE UPDATE, BLOCK CAN BE DONE BY ADMIN ------ (USER, ADMIN ENDPOINT)
router.patch('/:id', validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)



export const UserRoutes = router;