import { TGenericErrorResponse } from "../interfaces/error.types";


export const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const duplicate = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${duplicate[1]} Already Exist!!`
    }
}