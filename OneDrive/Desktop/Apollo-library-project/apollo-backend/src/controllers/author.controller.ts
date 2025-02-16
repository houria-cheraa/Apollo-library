import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Author } from "../models/author.model";
import { z } from "zod";
import mongoose from "mongoose";
import logger from "../utils/logger";

const authorSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    gender: z.enum(["Male", "Female"], {
        message: "Gender must be either Male or Female",
    }),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Invalid date format (YYYY-MM-DD)",
    }),
    country: z.string().min(1, { message: "Country is required" }),
    bibliography: z.string().min(1, { message: "Bibliography is required" }),
});

const getAllAuthors = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
        try {
            const authors = await Author.find();
            res.status(200).json(authors);
        } catch (error) {
            logger.error("Error getting authors: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

const getAuthor = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Invalid author ID format" });
                return;
            }

            const author = await Author.findById(id);
            if (!author) {
                res.status(404).json({ message: "Author not found" });
                return;
            }

            res.status(200).json(author);
        } catch (error) {
            console.error("Error getting author: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

const createAuthor = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        try {
            const validation = authorSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({ errors: validation.error.format() });
                return;
            }

            const {
                firstName,
                lastName,
                gender,
                birthDate,
                country,
                bibliography,
            } = validation.data;

            const author = new Author({
                firstName,
                lastName,
                gender,
                birthDate,
                country,
                bibliography,
            });

            await author.save();
            res.status(201).json(author);
        } catch (error) {
            console.error("Error Creating author: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

const updateAuthor = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Invalid author ID format" });
                return;
            }

            const validation = authorSchema.safeParse(req.body);
            if (!validation.success) {
                res.status(400).json({ errors: validation.error.format() });
                return;
            }

            const updatedAuthor = await Author.findByIdAndUpdate(
                id,
                { $set: validation.data },
                { new: true, runValidators: true }
            );

            if (!updatedAuthor) {
                res.status(404).json({ message: "Author not found" });
                return;
            }

            res.status(200).json(updatedAuthor);
        } catch (error) {
            logger.error("Error updating author: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

const deleteAuthor = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Invalid author ID format" });
                return;
            }

            const author = await Author.findById(id);
            if (!author) {
                res.status(404).json({ message: "Author not found" });
                return;
            }

            await author.deleteOne();

            res.status(200).json({
                message: `Author with ID: ${id} has been successfully deleted.`,
            });
        } catch (error) {
            console.error("Error deleting author: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

export { getAllAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor };
