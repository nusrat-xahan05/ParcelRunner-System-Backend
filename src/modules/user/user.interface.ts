import { Types } from "mongoose";

export enum UserStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthProvider {
    provider: "Google" | "Credential"; // "Google", "Credential(email password)"
    providerId: string;
}

export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER"
}

export interface IUser {
    // _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    // isDeleted?: boolean;
    userStatus?: UserStatus;
    isVerified?: boolean;
    auths: IAuthProvider[];
    role: Role;
    // parcels?: Types.ObjectId[];
}