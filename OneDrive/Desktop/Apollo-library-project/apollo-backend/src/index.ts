import "dotenv/config";
import app from "./app";
import connectDB from "./db/index";
import logger from "./utils/logger";

const PORT = process.env.PORT || 7000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Server running on port http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        logger.error("Error connecting to the database: ", error);
        process.exit(1);
    });
