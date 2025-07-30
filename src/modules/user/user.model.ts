import { model, Schema } from "mongoose";
import { IUser, Role, UserStatus } from "./user.interface";


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
    isVerified: {
        type: Boolean,
        default: false
    },
    // auths: [authProviderSchema],
    role: {
        type: String,
        enum: Object.values(Role),
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})


export const User = model<IUser>("User", userSchema);