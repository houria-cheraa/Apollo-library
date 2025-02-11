import { time, timeStamp } from "console";
import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: [true, "Customer is required"],
        },
        deliveryAddress: {
            type: String,
            required: [true, "Delivery Address is required"],
        },
        orderItems: [
            {
                type: Schema.Types.ObjectId,
                ref: "OrderItem",
            },
        ],
        total: {
            type: Number,
            required: [true, "Total is required"],
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
