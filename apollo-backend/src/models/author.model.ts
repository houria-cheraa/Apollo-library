import mongoose, { Schema } from "mongoose";

const authorSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: [true, "Gender is required"],
    },
    birthDate: {
        type: Date,
        required: [true, "Birth Date is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
    bibliography: {
        type: String,
        required: [true, "Bibliography is required"],
    },
    books: [
        {
            type: [Schema.Types.ObjectId],
            ref: "Book",
        },
    ],
});

export const Author = mongoose.model("Author", authorSchema);
