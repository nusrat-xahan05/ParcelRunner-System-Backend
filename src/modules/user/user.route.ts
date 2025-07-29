import { Router } from "express";
import { UserControllers } from "./user.controller";

const router = Router()

// USER REGISTRATION ------ (USER ENDPOINT)
router.post('/register', UserControllers.createUser)
// router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser)

// GET ALL USERS ------ (ADMIN ENDPOINT)
// router.get('/all-users', checkAuth(Role.ADMIN), UserControllers.getAllUsers)

// GET CURRENT USER ------ (USER ENDPOINT)
// router.post('/me', UserControllers.createUser)

// USER PROFILE UPDATE, BLOCK CAN BE DONE BY ADMIN ------ (USER, ADMIN ENDPOINT)
// router.patch('/:id', validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)



export const UserRoutes = router;