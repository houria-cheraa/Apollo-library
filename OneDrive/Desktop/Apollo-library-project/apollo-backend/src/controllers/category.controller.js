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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getAllCategories = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const category_model_1 = require("../models/category.model");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
});
const getAllCategories = (0, asyncHandler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.Category.find();
        res.json(categories);
    }
    catch (error) {
        logger_1.default.error("Error getting categories: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.getAllCategories = getAllCategories;
const getCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid author ID format" });
            return;
        }
        const category = yield category_model_1.Category.findById(id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        logger_1.default.error("Error getting category: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.getCategory = getCategory;
const createCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = categorySchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }
        const { name, description } = validation.data;
        const category = new category_model_1.Category({
            name,
            description,
        });
        yield category.save();
        res.status(201).json(category);
    }
    catch (error) {
        logger_1.default.error("Error Creating author: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.createCategory = createCategory;
const updateCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid author ID format" });
            return;
        }
        const category = yield category_model_1.Category.findById(id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        const validation = categorySchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return;
        }
        const updatedCategory = yield category_model_1.Category.findByIdAndUpdate(id, { $set: validation.data }, { new: true, runValidators: true });
        if (!updatedCategory) {
            res.status(404).json({ message: "Author not found" });
            return;
        }
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        logger_1.default.error("Error updating category: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.updateCategory = updateCategory;
const deleteCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid author ID format" });
            return;
        }
        const category = yield category_model_1.Category.findById(id);
        if (!category) {
            res.status(404).json({ message: "Author not found" });
            return;
        }
        yield category.deleteOne();
        res.status(200).json({
            message: `Category with ID: ${id} has been successfully deleted.`,
        });
    }
    catch (error) {
        logger_1.default.error("Error deleting category: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.deleteCategory = deleteCategory;
