import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

const morganFormat = ":method :url :status :response-time ms";

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);
app.use(cookieParser());

import healthcheckRouter from "./routes/healthcheck.routes";
import customerRouter from "./routes/customer.routes";
import authorRouter from "./routes/author.routes";
import categoryRouter from "./routes/category.routes";
import bookRouter from "./routes/book.routes";
import collectionRouter from "./routes/collection.routes";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/authors", authorRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/collections", collectionRouter);


export default app;
