import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
    itemType: {
        type: String,
        enum: ["Book", "Collection"],
        required: true,
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
    },
    bookCollection: {
        type: Schema.Types.ObjectId,
        ref: "BookCollection",
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

export const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
