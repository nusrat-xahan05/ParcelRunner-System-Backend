import z from "zod";
import { UserStatus, Role, AgentStatus } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string({
            invalid_type_error: "Name Must Be String",
            required_error: 'Name is Required'
        })
        .min(2, { message: "Name Too Short" })
        .max(50, { message: "Name Too Long" }),
    email: z
        .string({
            invalid_type_error: "Email Must Be String",
            required_error: 'Email is Required'
        })
        .email({ message: "Invalid Email Address Format" })
        .min(5, { message: "Email Must Be At Least 5 Characters Long" })
        .max(100, { message: "Email Cannot Exceed 100 Characters" }),
    password: z
        .string({
            invalid_type_error: "Password Must Be String",
            required_error: 'Password is Required'
        })
        .min(8, { message: "Password Must Be At Least 8 Characters Long" })
        .regex(/^(?=.*[A-Z])/, { message: "Password Must Contain At Least 1 Uppercase Letter" })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password Must Contain At Least 1 Special Character" })
        .regex(/^(?=.*\d)/, { message: "Password Must Contain At Least 1 Number" }),
    phone: z
        .string({
            invalid_type_error: "Phone Number Must Be String",
            required_error: 'Phone Number is Required'
        })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone Number Must Be Valid For Bangladesh. Formal: +8801XXXXXXXXX OR 01XXXXXXXXX" }),
    address: z
        .string({ invalid_type_error: "Address Must Be String" })
        .max(200, { message: "Address Cannot Exceed 200 Characters" })
        .optional(),
    userStatus: z
        .enum(Object.values(UserStatus) as [string], {
            errorMap: (issue, value) => {
                return { message: `Status Must Be 'ACTIVE' or 'BLOCKED'. ${value.data} is Not Acceptable` }
            }
        })
        .optional(),
    role: z
        .enum(Object.values(Role) as [string], {
            errorMap: (issue, value) => {
                return { message: `Role Must Be 'SENDER' or 'RECEIVER'. ${value.data} is Not Acceptable` }
            }
        })
        .optional()
        .refine((val) => val !== undefined, { message: 'Role is Required' }),
    agentStatus: z
        .string()
        .optional()
})


export const updateUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name Must Be String" })
        .min(2, { message: "Name Too Short" })
        .max(50, { message: "Name Too Long" })
        .optional(),
    password: z
        .string({ invalid_type_error: "Password Must Be String" })
        .min(8, { message: "Password Must Be At Least 8 Characters Long" })
        .regex(/^(?=.*[A-Z])/, { message: "Password Must Contain At Least 1 Uppercase Letter" })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password Must Contain At Least 1 Special Character" })
        .regex(/^(?=.*\d)/, { message: "Password Must Contain At Least 1 Number" })
        .optional(),
    phone: z
        .string({ invalid_type_error: "Phone Number Must Be String" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone Number Must Be Valid For Bangladesh. Formal: +8801XXXXXXXXX OR 01XXXXXXXXX" })
        .optional(),
    address: z
        .string({ invalid_type_error: "Address Must Be String" })
        .max(200, { message: "Address Cannot Exceed 200 Characters" })
        .optional(),
    userStatus: z
        .enum(Object.values(UserStatus) as [string], {
            errorMap: (issue, value) => {
                return { message: `Status Must Be 'ACTIVE' or 'BLOCKED'. ${value.data} is Not Acceptable` }
            }
        })
        .optional(),
    isVerified: z
        .boolean({ invalid_type_error: "Verified Must Be True or False" })
        .optional(),
    role: z
        .enum(Object.values(Role) as [string], {
            errorMap: (issue, value) => {
                return { message: `${value.data} is Not Acceptable` }
            }
        })
        .optional(),
    agentStatus: z
        .string()
        .optional()
})


export const reviewAgentRequestZodSchema = z.object({
    userId: z
        .string()
        .optional(),
    agentStatus: z
        .enum(Object.values(AgentStatus) as [string], {
            errorMap: (issue, value) => {
                return { message: `${value.data} is Not Acceptable` }
            }
        })
        .optional()
        .refine((val) => val !== undefined, { message: 'Agent Status is Required' }),
    reviewedBy: z
        .string()
        .optional()
})

