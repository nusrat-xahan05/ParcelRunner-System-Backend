import { JwtPayload } from "jsonwebtoken";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";


// CREATE PARCEL ------
const createParcel = async (payload: Partial<IParcel>, decodedToken: JwtPayload) => {
    const trackingId = await generateTrackingId();

    const parcel = await Parcel.create({
        ...payload,
        senderEmail: decodedToken.email,
        senderId: decodedToken.userId,
        trackingId,
        currentStatus: ParcelStatus.REQUESTED,
        parcelStatusLog: [{
            status: ParcelStatus.REQUESTED,
            updatedBy: decodedToken.role,
            updaterId: decodedToken.userId
        }]
    });
    return parcel;
}

// GET ALL PARCELS ------
const getAllParcels = async () => {
    const parcels = await Parcel.find({});
    const totalParcels = await Parcel.countDocuments();

    return {
        data: parcels,
        meta: {
            total: totalParcels
        }
    };
}

// GET SINGLE PARCEL ------
const getSingleParcel = async (id: string) => {
    const isParcelExist = await Parcel.findById(id);
    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Id");
    }

    return {
        data: isParcelExist
    }
};

// GET MY PARCELS ------
const getMyParcels = async (userId: string) => {
    const user = await Parcel.find({ senderId: userId });

    return {
        data: user
    }
};

// MANAGE PARCEL ------
const manageParcel = async (parcelId: string, payload: Partial<IParcel>, decodedToken: JwtPayload) => {
    const isParcelExist = await Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Id");
    }

    if (payload.currentStatus) {
        if (payload.currentStatus === isParcelExist.currentStatus) {
            throw new AppError(httpStatus.BAD_REQUEST, `Parcel is Already ${isParcelExist.currentStatus}`);
        }
        else if ((payload.currentStatus === ParcelStatus.BLOCKED) && ((isParcelExist.currentStatus === ParcelStatus.REQUESTED) || (isParcelExist.currentStatus === ParcelStatus.APPROVED) || (isParcelExist.currentStatus === ParcelStatus.DISPATCHED))) {
            isParcelExist.currentStatus = ParcelStatus.BLOCKED;
        }
        else if ((payload.currentStatus === ParcelStatus.APPROVED) && ((isParcelExist.currentStatus === ParcelStatus.REQUESTED) || (isParcelExist.currentStatus === ParcelStatus.BLOCKED))) {
            const isUserExist = await User.findById(payload.agentId);
            if ((!isUserExist) || (isUserExist.role !== Role.AGENT)) {
                throw new AppError(httpStatus.BAD_REQUEST, "No Agent Exist With This Agent Id");
            }

            isParcelExist.currentStatus = ParcelStatus.APPROVED;
            isParcelExist.agentId = payload.agentId;
        }
        else if ((payload.currentStatus === ParcelStatus.CANCELLED) && ((isParcelExist.currentStatus === ParcelStatus.REQUESTED) || (isParcelExist.currentStatus === ParcelStatus.APPROVED))){
            isParcelExist.currentStatus = ParcelStatus.CANCELLED;
        }
        else {
            throw new AppError(httpStatus.BAD_REQUEST, `Cannot ${payload.currentStatus}. Parcel is Already ${isParcelExist.currentStatus}`);
        }
        isParcelExist.parcelStatusLog.push({
            status: isParcelExist.currentStatus,
            updatedBy: decodedToken.role,
            updaterId: decodedToken.userId,
        })
    }
    await isParcelExist.save();

    let { agentId, currentStatus, ...rest } = payload;
    const parcel = await Parcel.findByIdAndUpdate(
        parcelId,
        {
            agentId: isParcelExist.agentId,
            currentStatus: isParcelExist.currentStatus,
            ...rest
        },
        { new: true, runValidators: true });

    return {
        data: parcel
    }
};

// UPDATE PARCEL-STATUS ------
const updateParcelStatus = async (parcelId: string, payload: Partial<IParcel>, decodedToken: JwtPayload) => {
    const isParcelExist = await Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Id");
    }

    const { currentStatus, ...rest } = payload;
    isParcelExist.currentStatus = payload.currentStatus!;

    isParcelExist.parcelStatusLog.push({
        status: payload.currentStatus!,
        updatedBy: decodedToken.role,
        updaterId: decodedToken.userId,
    })
    await isParcelExist.save();

    return {
        data: isParcelExist
    }
};

// CANCEL PARCEL ------
const cancelParcel = async (parcelId: string, decodedToken: JwtPayload) => {
    const isParcelExist = await Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Id");
    }

    if ((isParcelExist.currentStatus !== ParcelStatus.REQUESTED) && (isParcelExist.currentStatus !== ParcelStatus.APPROVED) && (isParcelExist.currentStatus === ParcelStatus.CANCELLED)) {
        throw new AppError(httpStatus.BAD_REQUEST, `Sorry, You Can't Cancel a ${isParcelExist.currentStatus} Parcel`);
    }

    isParcelExist.currentStatus = ParcelStatus.CANCELLED;
    isParcelExist.parcelStatusLog.push({
        status: ParcelStatus.CANCELLED,
        updatedBy: decodedToken.role,
        updaterId: decodedToken.userId
    })
    await isParcelExist.save();

    return {
        data: isParcelExist
    }
};

// CONFIRM PARCEL DELIVERY ------
const confirmDelivery = async (parcelId: string, decodedToken: JwtPayload) => {
    const isParcelExist = await Parcel.findById(parcelId);
    if (!isParcelExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Parcel Exist With This Id");
    }

    if(isParcelExist.currentStatus !== ParcelStatus.OUT_FOR_DELIVERY){
        throw new AppError(httpStatus.BAD_REQUEST, `Can't Do This Operation Right Now. The Parcel is ${isParcelExist.currentStatus}`);
    }

    isParcelExist.currentStatus = ParcelStatus.DELIVERED;
    isParcelExist.parcelStatusLog.push({
        status: ParcelStatus.DELIVERED,
        updatedBy: decodedToken.role,
        updaterId: decodedToken.userId,
    })
    await isParcelExist.save();

    return {
        data: isParcelExist
    }
};

export const ParcelServices = {
    createParcel, getAllParcels, getMyParcels, getSingleParcel, manageParcel, updateParcelStatus, cancelParcel, confirmDelivery
}