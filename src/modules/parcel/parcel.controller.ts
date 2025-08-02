import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { ParcelServices } from "./parcel.service";
import { JwtPayload } from "jsonwebtoken";


// CREATE PARCEL ------
const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const parcel = await ParcelServices.createParcel(req.body, decodedToken)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Parcel Created Successfully",
        data: parcel,
    })
})

// GET ALL PARCELS ------
const getAllParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ParcelServices.getAllParcels();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Parcels Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

// GET SINGLE PARCEL ------
const getSingleParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await ParcelServices.getSingleParcel(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel Retrieved Successfully",
        data: result.data
    })
})

// GET MY PARCELS ------
const getMyParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await ParcelServices.getMyParcels(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your Parcels Retrieved Successfully",
        data: result.data
    })
})

// MANAGE PARCEL ------
const manageParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.id;
    const decodedToken = req.user;
    const payload = req.body;
    const result = await ParcelServices.manageParcel(parcelId, payload, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel Updated Successfully",
        data: result.data
    })
})

// UPDATE PARCEL-STATUS ------
const updateParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const decodedToken = req.user;
    const result = await ParcelServices.updateParcelStatus(id, req.body, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel Status Updated Successfully",
        data: result.data
    })
})

// CENCEL PARCEL ------
const cancelParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.id;
    const decodedToken = req.user;
    const result = await ParcelServices.cancelParcel(parcelId, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your Parcel Cancelled Successfully",
        data: result.data
    })
})

// CONFIRM PARCEL DELIVERY ------
const confirmDelivery = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const decodedToken = req.user;
    const result = await ParcelServices.confirmDelivery(id, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel Is Delivered Successfully",
        data: result.data
    })
})

export const ParcelControllers = {
    createParcel, getAllParcels, getMyParcels, getSingleParcel, manageParcel, updateParcelStatus, cancelParcel, confirmDelivery
}