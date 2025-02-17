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
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getAllBooks = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const book_model_1 = require("../models/book.model");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const cloudinary_1 = require("../utils/cloudinary");
const bookSchema = zod_1.z.object({
    isbn: zod_1.z.string().min(1, { message: "ISBN is required" }),
    title: zod_1.z.string().min(1, { message: "Title is required" }),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    price: zod_1.z.string().min(0, { message: "Price must be a positive number" }),
    edition: zod_1.z.string().min(1, { message: "Edition is required" }),
    authors: zod_1.z.string().min(1, { message: "Authors are required" }),
    publisher: zod_1.z.string().min(1, { message: "Publisher is required" }),
    publicationDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Invalid date format (YYYY-MM-DD)",
    }),
    categories: zod_1.z.string().min(1, { message: "Categories are required" }),
    stock: zod_1.z.string().min(0, { message: "Stock must be a positive number" }),
    // cover: z.string().min(1, { message: "Cover is required" }),
});
const getAllBooks = (0, asyncHandler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield book_model_1.Book.find();
        res.status(200).json(books);
    }
    catch (error) {
        logger_1.default.error("Error getting books: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.getAllBooks = getAllBooks;
const getBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid book ID format" });
            return;
        }
        const book = yield book_model_1.Book.findById(id);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json(book);
    }
    catch (error) {
        logger_1.default.error("Error getting book: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.getBook = getBook;
const createBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = bookSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }
        const { isbn, title, description, price, edition, authors, publisher, publicationDate, categories, stock, } = validation.data;
        let coverLocalPath;
        if (req.file && req.file.path) {
            coverLocalPath = req.file.path;
        }
        if (!coverLocalPath) {
            res.status(400).json({ message: "Cover is required" });
            return;
        }
        const cover = yield (0, cloudinary_1.uploadOnCloudinary)(coverLocalPath);
        const book = new book_model_1.Book({
            isbn,
            title,
            description,
            price,
            edition,
            authors,
            publisher,
            publicationDate,
            categories,
            stock,
            cover: (cover === null || cover === void 0 ? void 0 : cover.url) || "",
        });
        yield book.save();
        res.status(201).json(book);
    }
    catch (error) {
        logger_1.default.error("Error creating book: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.createBook = createBook;
const updateBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid book ID format" });
            return;
        }
        const validation = bookSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }
        const updatedBook = yield book_model_1.Book.findByIdAndUpdate(id, { $set: validation.data }, { new: true, runValidators: true });
        if (!updatedBook) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json(updatedBook);
    }
    catch (error) {
        logger_1.default.error("Error updating book: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.updateBook = updateBook;
const deleteBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid book ID format" });
            return;
        }
        const book = yield book_model_1.Book.findById(id);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        yield book.deleteOne();
        res.status(200).json({
            message: `Book with ID: ${id} has been successfully deleted.`,
        });
    }
    catch (error) {
        logger_1.default.error("Error deleting book: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.deleteBook = deleteBook;
