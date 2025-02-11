import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Book } from "../models/book.model";
import { z } from "zod";
import mongoose from "mongoose";
import logger from "../utils/logger";
import { uploadOnCloudinary } from "../utils/cloudinary";

const bookSchema = z.object({
    isbn: z.string().min(1, { message: "ISBN is required" }),
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: z.string().min(0, { message: "Price must be a positive number" }),
    edition: z.string().min(1, { message: "Edition is required" }),
    authors: z.string().min(1, { message: "Authors are required" }),
    publisher: z.string().min(1, { message: "Publisher is required" }),
    publicationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Invalid date format (YYYY-MM-DD)",
    }),
    categories: z.string().min(1, { message: "Categories are required" }),
    stock: z.string().min(0, { message: "Stock must be a positive number" }),
    // cover: z.string().min(1, { message: "Cover is required" }),
});

const getAllBooks = asyncHandler(async (_req: Request, res: Response) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        logger.error("Error getting books: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const getBook = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid book ID format" });
            return;
        }

        const book = await Book.findById(id);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }

        res.status(200).json(book);
    } catch (error) {
        logger.error("Error getting book: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const createBook = asyncHandler(async (req: Request, res: Response) => {
    try {
        const validation = bookSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }
        const {
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
        } = validation.data;

        let coverLocalPath;
        if (req.file && req.file.path) {
            coverLocalPath = req.file.path;
        }

        if (!coverLocalPath) {
            res.status(400).json({ message: "Cover is required" });
            return;
        }

        const cover = await uploadOnCloudinary(coverLocalPath);

        const book = new Book({
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
            cover: cover?.url || "",
        });

        await book.save();
        res.status(201).json(book);
    } catch (error) {
        logger.error("Error creating book: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const updateBook = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid book ID format" });
            return;
        }

        const validation = bookSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }

        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { $set: validation.data },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            res.status(404).json({ message: "Book not found" });
            return;
        }

        res.status(200).json(updatedBook);
    } catch (error) {
        logger.error("Error updating book: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const deleteBook = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid book ID format" });
            return;
        }

        const book = await Book.findById(id);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }

        await book.deleteOne();

        res.status(200).json({
            message: `Book with ID: ${id} has been successfully deleted.`,
        });
    } catch (error) {
        logger.error("Error deleting book: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export { getAllBooks, getBook, createBook, updateBook, deleteBook };
