import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Customer } from "../models/customer.model";
import { ApiResponse } from "../utils/ApiResponse";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/emailing";
import crypto from "crypto";

const generateAccessAndRefreshToken = async (customerId: any) => {
    try {
        const customer = await Customer.findById(customerId);

        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        const accessToken = (customer as any).generateAccessToken();
        const refreshToken = (customer as any).generateRefreshToken();

        customer.refreshToken = refreshToken;
        await customer.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, gender } = req.body;

    if (
        [firstName, lastName, email, password].some(
            (field) => field?.trim() === "" || !field
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
        throw new ApiError(409, "Email already exists");
    }

    const confirmationCode = crypto.randomBytes(32).toString("hex");

    const customer = await Customer.create({
        firstName,
        lastName,
        email: email?.toLowerCase(),
        password,
        gender,
        confirmationCode,
    });

    const createdCustomer = await Customer.findById(customer._id);

    if (!createdCustomer) {
        throw new ApiError(
            500,
            "Something went wrong while registering the customer"
        );
    }

    const confirmationLink = `http://localhost:${process.env.PORT}/api/v1/customers/confirm-email/${confirmationCode}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Apollo Bookshop Account</title>
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
                            <h2 style="font-family: 'Playfair Display', serif; color: #92400e; font-size: 24px; margin-top: 0;">Confirm Your Email</h2>
                            <p style="color: #78350f; line-height: 1.6;">Dear Othmane,</p>
                            <p style="color: #78350f; line-height: 1.6;">Thank you for signing up at Apollo Bookshop! To activate your account, please confirm your email address by clicking the button below:</p>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="${confirmationLink}" 
                                           style="display: inline-block; padding: 12px 24px; background-color: #d97706; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">
                                           Confirm Email
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #78350f; line-height: 1.6; margin-top: 30px;">If you didn’t sign up for an account, you can ignore this email.</p>
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
</html>`;

    const userEmail = email?.toLowerCase();

    await sendEmail(userEmail, "Confirm Your Apollo Bookshop Account", html);

    res.status(201).json(
        new ApiResponse(201, createdCustomer, "Customer registered")
    );
});

const confirmEmail = asyncHandler(async (req: Request, res: Response) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { confirmationCode: req.params.token },
            { $set: { confirmed: true, confirmationCode: "" } },
            { new: true }
        ).select("-password -refreshToken");

        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        res.status(200).json(
            new ApiResponse(200, customer, "Email confirmed successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while confirming email");
    }
});

const loginCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const customer = await Customer.findOne({ email: email?.toLowerCase() });

    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    const isPasswordCorrect = await (customer as any).isPasswordCorrect(
        password
    );

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        customer._id
    );

    const loggedInCustomer = await Customer.findById(customer._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { customer: loggedInCustomer, accessToken, refreshToken },
                "Customer logged in successfully"
            )
        );
});

const logoutCustomer = asyncHandler(async (req: Request, res: Response) => {
    await Customer.findByIdAndUpdate(
        req.body._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Customer logged out successfully"));
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_SECRET as string
        );

        const customer = await Customer.findById((decodedToken as any)?._id);

        if (!customer || customer?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(customer._id);

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, newRefreshToken },
                    "Token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while refreshing token");
    }
});

export {
    registerCustomer,
    loginCustomer,
    logoutCustomer,
    refreshToken,
    confirmEmail,
};
