"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./db/index"));
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT || 3000;
(0, index_1.default)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        logger_1.default.info(`Server running on port http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    logger_1.default.error("Error connecting to the database: ", error);
    process.exit(1);
});
