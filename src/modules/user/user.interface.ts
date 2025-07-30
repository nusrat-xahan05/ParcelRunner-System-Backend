import { Types } from "mongoose";

export enum UserStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED"
}

export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER"
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    userStatus?: UserStatus;
    isVerified?: boolean;
    role: Role;
    // parcels?: Types.ObjectId[];
}