import mongoose from "mongoose";
import logger from "../utils/logger";
import { Employee } from "../models/employee.model";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_CONNECTION_STRING as string
        );
        logger.info(
            `Connected to the database! DB Host: ${connectionInstance.connection.host}`
        );
        const adminExists = await Employee.findOne({ isAdmin: true });
        if (!adminExists) {
            await Employee.create({
                firstName: process.env.ADMIN_FIRST_NAME as string,
                lastName: process.env.ADMIN_LAST_NAME as string,
                gender: process.env.ADMIN_GENDER as string,
                email: process.env.ADMIN_EMAIL as string,
                password: process.env.ADMIN_PASSWORD as string,
                isAdmin: true,
            });
            logger.info("Admin user created.");
        } else {
            logger.warn("Admin already exists.");
        }
    } catch (error) {
        logger.error("Error connecting to the database: ", error);
        process.exit(1);
    }
};

export default connectDB;
