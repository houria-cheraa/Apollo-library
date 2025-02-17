"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuthor = exports.updateAuthor = exports.createAuthor = exports.getAuthor = exports.getAllAuthors = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const author_model_1 = require("../models/author.model");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const authorSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, { message: "First name is required" }),
    lastName: zod_1.z.string().min(1, { message: "Last name is required" }),
    gender: zod_1.z.enum(["Male", "Female"], {
        message: "Gender must be either Male or Female",
    }),
    birthDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Invalid date format (YYYY-MM-DD)",
    }),
    country: zod_1.z.string().min(1, { message: "Country is required" }),
    bibliography: zod_1.z.string().min(1, { message: "Bibliography is required" }),
});
const getAllAuthors = (0, asyncHandler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authors = yield author_model_1.Author.find();
        res.status(200).json(authors);
    }
    catch (error) {
        logger_1.default.error("Error getting authors: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.getAllAuthors = getAllAuthors;
const getAuthor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid author ID format" });
            return;
        }
        const author = yield author_model_1.Author.findById(id);
        if (!author) {
            res.status(404).json({ message: "Author not found" });
            return;
        }
        res.status(200).json(author);
    }
    catch (error) {
        console.error("Error getting author: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.getAuthor = getAuthor;
const createAuthor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = authorSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }
        const { firstName, lastName, gender, birthDate, country, bibliography, } = validation.data;
        const author = new author_model_1.Author({
            firstName,
            lastName,
            gender,
            birthDate,
            country,
            bibliography,
        });
        yield author.save();
        res.status(201).json(author);
    }
    catch (error) {
        console.error("Error Creating author: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.createAuthor = createAuthor;
const updateAuthor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid author ID format" });
            return;
        }
        const validation = authorSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }
        const updatedAuthor = yield author_model_1.Author.findByIdAndUpdate(id, { $set: validation.data }, { new: true, runValidators: true });
        if (!updatedAuthor) {
            res.status(404).json({ message: "Author not found" });
            return;
        }
        res.status(200).json(updatedAuthor);
    }
    catch (error) {
        logger_1.default.error("Error updating author: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.updateAuthor = updateAuthor;
const deleteAuthor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid author ID format" });
            return;
        }
        const author = yield author_model_1.Author.findById(id);
        if (!author) {
            res.status(404).json({ message: "Author not found" });
            return;
        }
        yield author.deleteOne();
        res.status(200).json({
            message: `Author with ID: ${id} has been successfully deleted.`,
        });
    }
    catch (error) {
        console.error("Error deleting author: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.deleteAuthor = deleteAuthor;
