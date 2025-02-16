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
        deliveryDate: {
            type: Date,
            required: [true, "Delivery Date is required"],
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
        orderStatus: {
            type: String,
            enum: ["Pending", "Shipped", "Delivered", "Canceled", "Returned"],
            default: "Pending",
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: ["Pending", "Shipped", "Delivered", "Canceled", "Returned"],
                    required: true,
                },
                changedAt: {
                    type: Date,
                    default: Date.now,
                },
                reason: {
                    type: String,
                },
            },
        ],
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
