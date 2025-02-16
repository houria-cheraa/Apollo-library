import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Category } from "../models/category.model";
import { z } from "zod";
import mongoose from "mongoose";
import logger from "../utils/logger";

const categorySchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
});

const getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        logger.error("Error getting categories: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const getCategory = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid author ID format" });
            return;
        }
        const category = await Category.findById(id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json(category);
    } catch (error) {
        logger.error("Error getting category: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const createCategory = asyncHandler(async (req: Request, res: Response) => {
    try {
        const validation = categorySchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }

        const { name, description } = validation.data;

        const category = new Category({
            name,
            description,
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        logger.error("Error Creating author: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid author ID format" });
            return;
        }

        const category = await Category.findById(id);

        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        const validation = categorySchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { $set: validation.data },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            res.status(404).json({ message: "Author not found" });
            return;
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        logger.error("Error updating category: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid author ID format" });
            return;
        }

        const category = await Category.findById(id);
        if (!category) {
            res.status(404).json({ message: "Author not found" });
            return;
        }

        await category.deleteOne();

        res.status(200).json({
            message: `Category with ID: ${id} has been successfully deleted.`,
        });
    } catch (error) {
        logger.error("Error deleting category: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};
