import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { OrderItem } from "../models/orderItem.model";
import { Book } from "../models/book.model";
import { BookCollection } from "../models/bookCollection.model";
import mongoose from "mongoose";
import { sendEmail } from "../services/emailing";
import { Document, Types } from "mongoose";

export interface IBook extends Document {
    isbn: string;
    title: string;
    description: string;
    price: number;
    edition: number;
    authors: Types.ObjectId[];
    publisher: string;
    publicationDate: Date;
    categories: Types.ObjectId[];
    stock: number;
    cover: string;
}

export interface IBookCollection extends Document {
    name: string;
    description: string;
    books: Types.ObjectId[];
    price: number;
}

export interface IOrderItem extends Document {
    itemType: "Book" | "Collection";
    book: Types.ObjectId | IBook;
    bookCollection: Types.ObjectId | IBookCollection;
    quantity: number;
    price: number;
}

export const createOrder = async (req: Request, res: Response) => {
    const { customer, deliveryAddress, deliveryDate, orderItems, email } = req.body;

    if (!customer || !deliveryAddress || !deliveryDate || !orderItems || orderItems.length === 0 || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let total = 0;
        const orderItemsDocs = [];

        for (const item of orderItems) {
            const { itemType, itemId, quantity } = item;
            let price = 0;

            if (itemType === "Book") {
                const book = await Book.findById(itemId).session(session);
                if (!book || book.stock < quantity) {
                    await session.abortTransaction();
                    return res.status(400).json({ message: "Invalid book or insufficient stock" });
                }
                price = book.price * quantity;
                book.stock -= quantity;
                await book.save({ session });
            } else if (itemType === "Collection") {
                const collection = await BookCollection.findById(itemId).session(session);
                if (!collection) {
                    await session.abortTransaction();
                    return res.status(400).json({ message: "Invalid collection" });
                }
                price = collection.price * quantity;
            } else {
                await session.abortTransaction();
                return res.status(400).json({ message: "Invalid item type" });
            }

            total += price;

            const orderItem = new OrderItem({
                itemType,
                [itemType === "Book" ? "book" : "bookCollection"]: itemId,
                quantity,
                price,
            });
            await orderItem.save({ session });
            orderItemsDocs.push(orderItem._id);
        }

        const order = new Order({
            customer,
            deliveryAddress,
            deliveryDate, // Added deliveryDate
            orderItems: orderItemsDocs,
            total,
            orderStatus: "Pending",
            statusHistory: [{ status: "Pending", updatedAt: new Date() }],
        });
        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Fetch order item details for the email
        const orderItemsDetails = await Promise.all(orderItemsDocs.map(async (itemId) => {
            const item = await OrderItem.findById(itemId)
                .populate<{ book: IBook }>('book')
                .populate<{ bookCollection: IBookCollection }>('bookCollection');
        
            return {
                quantity: item?.quantity,
                itemType: item?.itemType,
                title: item?.itemType === "Book" ? (item.book as IBook).title : (item?.bookCollection as IBookCollection).name,
                price: item?.price,
            };
        }));

        // Generate the email HTML
        const emailHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation - Apollo Bookshop</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lora&display=swap');
                </style>
            </head>
            <body style="margin: 0; padding: 0; min-width: 100%; font-family: 'Lora', serif; background-color: #fffbeb;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #fffbeb;">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <!-- Header -->
                                <tr>
                                    <td align="center" style="padding: 40px 0; background-color: #fef3c7; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                        <h1 style="font-family: 'Playfair Display', serif; color: #92400e; font-size: 28px; margin: 0;">Apollo Bookshop</h1>
                                    </td>
                                </tr>
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="font-family: 'Playfair Display', serif; color: #92400e; font-size: 24px; margin-top: 0;">Order Confirmation</h2>
                                        <p style="color: #78350f; line-height: 1.6;">Dear ${customer.name},</p>
                                        <p style="color: #78350f; line-height: 1.6;">Thank you for your order at Apollo Bookshop! Below are the details of your order:</p>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px; margin-bottom: 30px;">
                                            <tr>
                                                <td style="color: #78350f; font-size: 16px; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                                                    <strong>Order ID:</strong> ${order._id}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #78350f; font-size: 16px; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                                                    <strong>Delivery Address:</strong> ${deliveryAddress}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #78350f; font-size: 16px; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                                                    <strong>Delivery Date:</strong> ${new Date(deliveryDate).toLocaleDateString()}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #78350f; font-size: 16px; padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                                                    <strong>Order Items:</strong>
                                                </td>
                                            </tr>
                                            ${orderItemsDetails.map(item => `
                                                <tr>
                                                    <td style="color: #78350f; font-size: 14px; padding: 10px 20px;">
                                                        ${item.quantity}x ${item.title} - $${item.price?.toFixed(2)}
                                                    </td>
                                                </tr>
                                            `).join('')}
                                            <tr>
                                                <td style="color: #78350f; font-size: 16px; padding: 10px 0; border-top: 1px solid #f3f4f6;">
                                                    <strong>Total:</strong> $${order.total.toFixed(2)}
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="color: #78350f; line-height: 1.6;">Your order is currently being processed. We’ll notify you once it’s on its way.</p>
                                        <p style="color: #78350f; line-height: 1.6;">If you have any questions, feel free to <a href="https://apollobookshop.com/contact" style="color: #d97706; text-decoration: underline;">contact us</a>.</p>
                                        <p style="color: #78350f; line-height: 1.6;">Happy reading!</p>
                                        <p style="color: #78350f; line-height: 1.6;">The Apollo Bookshop Team</p>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px; background-color: #fef3c7; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="color: #92400e; font-size: 14px; line-height: 1.5; text-align: center;">
                                                    <p style="margin: 0;">Apollo Bookshop | 123 Olympus Avenue, Athens, Greece</p>
                                                    <p style="margin: 10px 0 0;">
                                                        <a href="https://apollobookshop.com" style="color: #92400e; text-decoration: underline;">Visit our website</a> |
                                                        <a href="https://apollobookshop.com/contact" style="color: #92400e; text-decoration: underline;">Contact us</a>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;
        
        await sendEmail(email, 'Order Confirmation - Apollo Bookshop', emailHtml);

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};