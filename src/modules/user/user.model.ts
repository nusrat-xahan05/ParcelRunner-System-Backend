import mongoose, { model, Schema } from "mongoose";
import { AgentStatus, IAgentRequest, IUser, Role, UserStatus } from "./user.interface";


// -------- USER MODEL SCHEMA
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    userStatus: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE
    },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true
    },
    agentStatus: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
})
export const User = model<IUser>("User", userSchema);



// -------- AGENT REQUEST BY USER MODEL SCHEMA
const agentRequestSchema = new Schema<IAgentRequest>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    agentStatus: {
        type: String,
        enum: Object.values(AgentStatus),
        default: AgentStatus.PENDING
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey: false
})
export const AgentRequest = model<IAgentRequest>("AgentRequest", agentRequestSchema);

