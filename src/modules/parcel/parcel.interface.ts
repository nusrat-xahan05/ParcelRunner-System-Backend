import { Types } from "mongoose";
import { Role } from "../user/user.interface";

export enum ServiceType {
    REGULAR = "REGULAR",
    SAME_DAY = "SAME DAY"
}

export enum DeliveryType {
    HOME = "HOME",
    ADDRESS_POINT = "ADDRESS POINT"
}

export enum ParcelType {
    FRAGILE = "FRAGILE",
    CLOTHES = "CLOTHES",
    ELECTRONICS = "ELECTRONICS",
    FOOD_ITEMS = "FOOD ITEMS",
    MEDICAL = "MEDICAL",
    DOCUMENTS = "DOCUMENTS",
    OTHERS = "OTHERS"
}

export enum ParcelStatus {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    ASSIGNED = "ASSIGNED",
    DISPATCHED = "DISPATCHED",
    IN_TRANSIT = "IN TRANSIT",
    OUT_FOR_DELIVERY = "OUT FOR DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    BLOCKED = "BLOCKED"
}

export interface IParcelStatusLog {
    status: ParcelStatus;
    timeStamp?:Date;
    updatedBy: Role;
    updaterId: Types.ObjectId;
    location? : string;
}

export interface IParcel {
    _id?: Types.ObjectId;
    trackingId?: string;
    serviceType: ServiceType;
    deliveryType: DeliveryType;
    parcelType: ParcelType;
    senderEmail?: string;
    senderId?: Types.ObjectId;
    receiverName: string;
    receiverEmail: string;
    receiverPhone: string;
    pickUpAddress: string;
    deliveryAddress: string;
    weight: number;
    codAmount: number;  // COLLECT FROM CUSTOMER AMOUNT
    // deliveryCost: number;
    agentId?: Types.ObjectId;
    currentStatus: ParcelStatus;
    parcelStatusLog: IParcelStatusLog[];
}