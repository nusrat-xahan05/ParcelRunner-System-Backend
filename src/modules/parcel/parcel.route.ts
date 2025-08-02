import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ParcelControllers } from "./parcel.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { agentParcelStatusZodSchema, createParcelZodSchema, manageParcelZodSchema } from "./parcel.validation";


const router = Router()

// CREATE PARCEL ------ (SENDER, ADMIN ENDPOINT)
router.post('/create-parcel', validateRequest(createParcelZodSchema), checkAuth(Role.ADMIN, Role.SENDER), ParcelControllers.createParcel);

// GET ALL PARCELS ------ (ADMIN ENDPOINT)
router.get('/all-parcels', checkAuth(Role.ADMIN), ParcelControllers.getAllParcels);

// GET MY PARCELS ------ (SENDER ENDPOINT)
router.get('/me', checkAuth(Role.SENDER), ParcelControllers.getMyParcels);

// GET INCOMING PARCELS ------ (RECEIVER ENDPOINT)
router.get('/incoming', checkAuth(Role.RECEIVER), ParcelControllers.getIncomingParcels);

// GET DELIVERY HISTORY ------ (RECEIVER ENDPOINT)
router.get('/history', checkAuth(Role.RECEIVER), ParcelControllers.viewHistory);

// TRACK THE PARCEL ------ (PUBLIC ENDPOINT)
router.get('/track/:id', ParcelControllers.trackParcel);

// GET SINGLE PARCEL ------ (ADMIN ENDPOINT)
router.get("/:id", checkAuth(Role.ADMIN), ParcelControllers.getSingleParcel);

// MANAGE PARCEL ------ (ADMIN ENDPOINT)
router.patch('/manage/:id', validateRequest(manageParcelZodSchema), checkAuth(Role.ADMIN), ParcelControllers.manageParcel);

// UPDATE PARCEL-STATUS ------ (AGENT ENDPOINT)
router.patch('/status-update/:id', validateRequest(agentParcelStatusZodSchema), checkAuth(Role.AGENT), ParcelControllers.updateParcelStatus);

// CENCEL PARCEL ------ (SENDER ENDPOINT)
router.patch('/cancel/:id', checkAuth(Role.ADMIN, Role.SENDER), ParcelControllers.cancelParcel);

// CONFIRM PARCEL DELIVERY ------ (RECEIVER ENDPOINT)
router.patch('/confirm-delivery/:id', checkAuth(Role.RECEIVER), ParcelControllers.confirmDelivery);




export const ParcelRoutes = router;