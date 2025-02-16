import mongoose, { Schema } from "mongoose";

const BookCollectionSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: "Book",
        },
    ],
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
});

export const BookCollection = mongoose.model(
    "BookCollection",
    BookCollectionSchema
);
