import { model, Schema } from "mongoose";
import { IAuthProvider, IUser, Role, UserStatus } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
    provider: {
        type: String,
        required: true
    },
    providerId: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    _id: false
})

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
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    // isDeleted: {
    //     type: Boolean,
    //     default: false
    // },
    userStatus: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    auths: [authProviderSchema],
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.RECEIVER
    }
}, {
    timestamps: true,
    versionKey: false
})


export const User = model<IUser>("User", userSchema);