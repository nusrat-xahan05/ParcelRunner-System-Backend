import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodTypeAny } from "zod";

export const validateRequest = (ZodSchema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = await ZodSchema.parseAsync(req.body)
        next()
    } catch (err) {
        next(err)
    }
}