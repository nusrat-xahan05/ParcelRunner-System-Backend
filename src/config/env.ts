import dotenv from "dotenv";

dotenv.config();

// INTERFACE DECLARATION FOR ENVCONFIG
interface IEnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "Development" | "Production",
}

const loadEnvVars = () : IEnvConfig => {
    const requiredEnvVars: string [] = ["PORT", "DB_URL", "NODE_ENV"];

    requiredEnvVars.forEach(key => {
        if(!process.env[key]){
            throw new Error(`Missing Required Environment Variable ${key}`);
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
    }
}

export const envVars = loadEnvVars();