import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";

let server: Server;

const startServer = async() => {
    try{
        await mongoose.connect(envVars.DB_URL);
        console.log("Connected To MongoDB");

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is Listening To Port ${envVars.PORT}`);
        })
    }catch(error){
        console.log(error);
    }
}

startServer();


// UNHANDLED REJECTION ERROR:
process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection Detected... Server Shutting Down. ", error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

// UNCAUGHT EXCEPTION ERROR:
process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception Detected... Server Shutting Down. ", error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

// SIGTERM ERROR:
process.on("SIGTERM", () => {
    console.log("SIGTERM Signal Received... Server Shutting Down. ");

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

// SIGINT ERROR:
process.on("SIGINT", () => {
    console.log("SIGINT Signal Received... Server Shutting Down. ");

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})