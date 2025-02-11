import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema({
    isbn: {
        type: String,
        required: [true, "ISBN is required"],
        unique: true,
    },
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    edition: {
        type: Number,
        required: [true, "Edition is required"],
    },
    authors: [
        {
            type: Schema.Types.ObjectId,
            ref: "Author",
        },
    ],
    publisher: {
        type: String,
        required: [true, "Publisher is required"],
    },
    publicationDate: {
        type: Date,
        required: [true, "Publication Date is required"],
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
    ],
    stock: {
        type: Number,
        required: [true, "Stock is required"],
    },
    cover: {
        type: String,
        required: [true, "Cover is required"],
    },
});

export const Book = mongoose.model("Book", BookSchema);
