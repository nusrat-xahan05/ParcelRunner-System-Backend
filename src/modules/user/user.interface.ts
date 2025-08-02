import { Types } from "mongoose";

export enum UserStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED"
}

export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER",
    AGENT = "AGENT"
}

export enum AgentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface IAgentRequest {
    userId?: Types.ObjectId;
    agentStatus: AgentStatus;
    reviewedBy?: Types.ObjectId;
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    userStatus?: UserStatus;
    role: Role;
    agentStatus?: string;
}