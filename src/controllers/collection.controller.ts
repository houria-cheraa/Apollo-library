import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { BookCollection } from "../models/bookCollection.model";
import { z } from "zod";
import mongoose from "mongoose";
import logger from "../utils/logger";

const bookCollectionSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    books: z
        .array(z.string())
        .min(2, { message: "Minumum 2 Books are required" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
});

const getAllBookCollections = asyncHandler(
    async (_req: Request, res: Response) => {
        try {
            const bookCollections = await BookCollection.find();
            res.status(200).json(bookCollections);
        } catch (error) {
            logger.error("Error getting book collections: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

const getBookCollection = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                message: "Invalid book collection ID format",
            });
            return;
        }

        const bookCollection = await BookCollection.findById(id);
        if (!bookCollection) {
            res.status(404).json({ message: "Book collection not found" });
            return;
        }

        res.status(200).json(bookCollection);
    } catch (error) {
        logger.error("Error getting book collection: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const createBookCollection = asyncHandler(
    async (req: Request, res: Response) => {
        try {
            const validation = bookCollectionSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({ message: validation.error });
                return;
            }

            const { name, description, books, price } = validation.data;

            const bookCollection = new BookCollection({
                name,
                description,
                books,
                price,
            });

            await bookCollection.save();

            res.status(201).json(bookCollection);
        } catch (error) {
            logger.error("Error creating book collection: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

const updateBookCollection = asyncHandler(
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
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

            const bookCollection = await BookCollection.findByIdAndUpdate(
                id,
                { $set: validation.data },
                { new: true, runValidators: true }
            );

            if (!bookCollection) {
                res.status(404).json({ message: "Book collection not found" });
                return;
            }

            res.status(200).json(bookCollection);
        } catch (error) {
            logger.error("Error updating book collection: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

const deleteBookCollection = asyncHandler(
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({
                    message: "Invalid book collection ID format",
                });
                return;
            }

            const bookCollection = await BookCollection.findById(id);
            if (!bookCollection) {
                res.status(404).json({ message: "Book collection not found" });
                return;
            }

            await bookCollection.deleteOne();
            res.status(204).end();
        } catch (error) {
            logger.error("Error deleting book collection: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

export {
    getAllBookCollections,
    getBookCollection,
    createBookCollection,
    updateBookCollection,
    deleteBookCollection,
};
