import z from "zod";
import { DeliveryType, ParcelStatus, ParcelType, ServiceType } from "./parcel.interface";
import { Role } from "../user/user.interface";


export const parcelStatusLogZodSchema = z.object({
    status: z
        .enum(Object.values(ParcelStatus) as [string], {
            errorMap: (issue, value) => {
                return { message: `${value.data} is Not Acceptable Type` }
            }
        }),
    timeStamp: z
        .string()
        .optional(),
    updatedBy: z
        .enum(Object.values(Role) as [string], {
            errorMap: (issue, value) => {
                return { message: `${value.data} is Not Acceptable Type` }
            }
        }),
    updaterId: z
        .string(),
    location: z
        .string()
        .optional()
});


export const createParcelZodSchema = z.object({
    trackingId: z
        .string()
        .optional(),
    serviceType: z
        .enum(Object.values(ServiceType) as [string], {
            errorMap: (issue, value) => {
                return { message: `${value.data} is Not Acceptable Type` }
            }
        }),
    deliveryType: z
        .enum(Object.values(DeliveryType) as [string], {
            errorMap: (issue, value) => {
                return { message: `${value.data} is Not Acceptable Type` }
            }
        }),
    parcelType: z
        .enum(Object.values(ParcelType) as [string], {
            errorMap: (issue, value) => {
                return { message: `${value.data} is Not Acceptable Type` }
            }
        }),
    senderEmail: z
        .string()
        .optional(),
    senderId: z
        .string()
        .optional(),
    receiverName: z
        .string({
            invalid_type_error: "Receiver Name Must Be String",
            required_error: 'Receiver Name is Required'
        })
        .min(2, { message: "Receiver Name Too Short" })
        .max(50, { message: "Receiver Name Too Long" }),
    receiverEmail: z
        .string({
            invalid_type_error: "Receiver Email Must Be String",
            required_error: 'Receiver Email is Required'
        })
        .email({ message: "Invalid Email Address Format" }),
    receiverPhone: z
        .string({
            invalid_type_error: "Receiver Phone Number Must Be String",
            required_error: 'Receiver Phone Number is Required'
        })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone Number Must Be Valid For Bangladesh. Formal: +8801XXXXXXXXX OR 01XXXXXXXXX" }),
    pickUpAddress: z
        .string({ invalid_type_error: "Pickup Address Must Be String" })
        .max(200, { message: "Pickup Address Cannot Exceed 400 Characters" }),
    deliveryAddress: z
        .string({ invalid_type_error: "Delivery Address Must Be String" })
        .max(200, { message: "Delivery Address Cannot Exceed 400 Characters" }),
    weight: z
        .number({
            invalid_type_error: 'Weight Must be a Number',
            required_error: 'Weight Number is required',
        }).min(.1, {
            message: 'Weight must be a Positive Number'
        }),
    codAmount: z
        .number({
            invalid_type_error: 'Cash On Delivery Amount Must be a Number',
            required_error: 'Cash On Delivery Amount Number is required',
        }).min(0, {
            message: 'Cash On Delivery Amount must be a Positive Number'
        }),
    agentId: z
        .string()
        .optional(),
    currentStatus: z
        .enum(Object.values(ParcelStatus) as [string], {
            errorMap: (issue, value) => {
                return { message: `${value.data} is Not Acceptable Type` }
            }
        })
        .optional(),
    parcelStatusLog: z
        .array(parcelStatusLogZodSchema)
        .optional()
})


export const manageParcelZodSchema = z.object({
    receiverPhone: z
        .string({
            invalid_type_error: "Receiver Phone Number Must Be String",
            required_error: 'Receiver Phone Number is Required'
        })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone Number Must Be Valid For Bangladesh. Formal: +8801XXXXXXXXX OR 01XXXXXXXXX" })
        .optional(),
    pickUpAddress: z
        .string({ invalid_type_error: "Pickup Address Must Be String" })
        .max(200, { message: "Pickup Address Cannot Exceed 400 Characters" })
        .optional(),
    deliveryAddress: z
        .string({ invalid_type_error: "Delivery Address Must Be String" })
        .max(200, { message: "Delivery Address Cannot Exceed 400 Characters" })
        .optional(),
    codAmount: z
        .number({
            invalid_type_error: 'Cash On Delivery Amount Must be a Number',
            required_error: 'Cash On Delivery Amount Number is required',
        }).min(0, {
            message: 'Cash On Delivery Amount must be a Positive Number'
        })
        .optional(),
    agentId: z
        .string({ invalid_type_error: 'Agent Id Must Be String' })
        .optional(),
    currentStatus: z
        .enum(Object.values(ParcelStatus) as [string], {
            errorMap: (issue, value) => {
                return { message: `${value.data} is Not Acceptable Type` }
            }
        })
        .optional(),
    parcelStatusLog: z
        .array(parcelStatusLogZodSchema)
        .optional()
}).refine((value) => {
    if((value.currentStatus === ParcelStatus.APPROVED) && !value.agentId){
        return false;
    }
    return true;
}, {
    message: "Need to Assign To An Agent as the Parcel is Approved"
})