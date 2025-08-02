import z from "zod";

export const loginZodSchema = z.object({
    email: z
        .string({
            required_error: 'Email is Required'
        })
        .email({ message: "Invalid Email Address Format" }),
    password: z
        .string({
            required_error: 'Password is Required'
        })
})

export const resetPasswordZodSchema = z.object({
    oldPassword: z
        .string({
            required_error: 'Old Password is Required'
        }),
    newPassword: z
        .string({
            invalid_type_error: "Password Must Be String",
            required_error: 'New Password is Required'
        })
        .min(8, { message: "Password Must Be At Least 8 Characters Long" })
        .regex(/^(?=.*[A-Z])/, { message: "Password Must Contain At Least 1 Uppercase Letter" })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password Must Contain At Least 1 Special Character" })
        .regex(/^(?=.*\d)/, { message: "Password Must Contain At Least 1 Number" }),
})