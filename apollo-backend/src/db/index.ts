import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_CONNECTION_STRING as string
        );
        logger.info(
            `Connected to the database! DB Host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        logger.error("Error connecting to the database: ", error);
        process.exit(1);
    }
};

export default connectDB;
