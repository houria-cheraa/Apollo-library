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
exports.deleteBookCollection = exports.updateBookCollection = exports.createBookCollection = exports.getBookCollection = exports.getAllBookCollections = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const bookCollection_model_1 = require("../models/bookCollection.model");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const bookCollectionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    books: zod_1.z
        .array(zod_1.z.string())
        .min(2, { message: "Minumum 2 Books are required" }),
    price: zod_1.z.number().min(0, { message: "Price must be a positive number" }),
});
const getAllBookCollections = (0, asyncHandler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookCollections = yield bookCollection_model_1.BookCollection.find();
        res.status(200).json(bookCollections);
    }
    catch (error) {
        logger_1.default.error("Error getting book collections: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.getAllBookCollections = getAllBookCollections;
const getBookCollection = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                message: "Invalid book collection ID format",
            });
            return;
        }
        const bookCollection = yield bookCollection_model_1.BookCollection.findById(id);
        if (!bookCollection) {
            res.status(404).json({ message: "Book collection not found" });
            return;
        }
        res.status(200).json(bookCollection);
    }
    catch (error) {
        logger_1.default.error("Error getting book collection: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.getBookCollection = getBookCollection;
const createBookCollection = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = bookCollectionSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ message: validation.error });
            return;
        }
        const { name, description, books, price } = validation.data;
        const bookCollection = new bookCollection_model_1.BookCollection({
            name,
            description,
            books,
            price,
        });
        yield bookCollection.save();
        res.status(201).json(bookCollection);
    }
    catch (error) {
        logger_1.default.error("Error creating book collection: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.createBookCollection = createBookCollection;
const updateBookCollection = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                message: "Invalid book collection ID format",
            });
            return;
        }
        const validation = bookCollectionSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ message: validation.error });
            return;
        }
        const { name, description, books, price } = validation.data;
        const bookCollection = yield bookCollection_model_1.BookCollection.findByIdAndUpdate(id, { $set: validation.data }, { new: true, runValidators: true });
        if (!bookCollection) {
            res.status(404).json({ message: "Book collection not found" });
            return;
        }
        res.status(200).json(bookCollection);
    }
    catch (error) {
        logger_1.default.error("Error updating book collection: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.updateBookCollection = updateBookCollection;
const deleteBookCollection = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                message: "Invalid book collection ID format",
            });
            return;
        }
        const bookCollection = yield bookCollection_model_1.BookCollection.findById(id);
        if (!bookCollection) {
            res.status(404).json({ message: "Book collection not found" });
            return;
        }
        yield bookCollection.deleteOne();
        res.status(204).end();
    }
    catch (error) {
        logger_1.default.error("Error deleting book collection: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.deleteBookCollection = deleteBookCollection;
