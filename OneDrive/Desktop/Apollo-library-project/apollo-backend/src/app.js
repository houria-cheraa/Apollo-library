"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./utils/logger"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const morganFormat = ":method :url :status :response-time ms";
const allowedOrigins = ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(",")) || ["http://localhost:5173"];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use(express_1.default.static("public"));
app.use((0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            };
            logger_1.default.info(JSON.stringify(logObject));
        },
    },
}));
app.use((0, cookie_parser_1.default)());
const healthcheck_routes_1 = __importDefault(require("./routes/healthcheck.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const author_routes_1 = __importDefault(require("./routes/author.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const collection_routes_1 = __importDefault(require("./routes/collection.routes"));
app.use("/api/v1/healthcheck", healthcheck_routes_1.default);
app.use("/api/v1/customers", customer_routes_1.default);
app.use("/api/v1/authors", author_routes_1.default);
app.use("/api/v1/categories", category_routes_1.default);
app.use("/api/v1/books", book_routes_1.default);
app.use("/api/v1/collections", collection_routes_1.default);
exports.default = app;
