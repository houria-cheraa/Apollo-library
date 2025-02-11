import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
});

export const Category = mongoose.model("Category", CategorySchema);
