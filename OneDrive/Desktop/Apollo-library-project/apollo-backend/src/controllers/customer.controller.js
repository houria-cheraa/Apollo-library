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
exports.confirmEmail = exports.refreshToken = exports.logoutCustomer = exports.loginCustomer = exports.registerCustomer = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiError_1 = require("../utils/ApiError");
const customer_model_1 = require("../models/customer.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailing_1 = require("../services/emailing");
const crypto_1 = __importDefault(require("crypto"));
const generateAccessAndRefreshToken = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_model_1.Customer.findById(customerId);
        if (!customer) {
            throw new ApiError_1.ApiError(404, "Customer not found");
        }
        const accessToken = customer.generateAccessToken();
        const refreshToken = customer.generateRefreshToken();
        customer.refreshToken = refreshToken;
        yield customer.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Something went wrong while generating tokens");
    }
});
const registerCustomer = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    if ([firstName, lastName, email, password].some((field) => (field === null || field === void 0 ? void 0 : field.trim()) === "" || !field)) {
        throw new ApiError_1.ApiError(400, "All fields are required");
    }
    const customerExists = yield customer_model_1.Customer.findOne({ email });
    if (customerExists) {
        throw new ApiError_1.ApiError(409, "Email already exists");
    }
    const confirmationCode = crypto_1.default.randomBytes(32).toString("hex");
    const customer = yield customer_model_1.Customer.create({
        firstName,
        lastName,
        email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
        password,
        confirmationCode,
    });
    const createdCustomer = yield customer_model_1.Customer.findById(customer._id);
    if (!createdCustomer) {
        throw new ApiError_1.ApiError(500, "Something went wrong while registering the customer");
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
    const userEmail = email === null || email === void 0 ? void 0 : email.toLowerCase();
    yield (0, emailing_1.sendEmail)(userEmail, "Confirm Your Apollo Bookshop Account", html);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, createdCustomer, "Customer registered"));
}));
exports.registerCustomer = registerCustomer;
const confirmEmail = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield customer_model_1.Customer.findOneAndUpdate({ confirmationCode: req.params.token }, { $set: { confirmed: true, confirmationCode: "" } }, { new: true }).select("-password -refreshToken");
        if (!customer) {
            throw new ApiError_1.ApiError(404, "Customer not found");
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, customer, "Email confirmed successfully"));
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Something went wrong while confirming email");
    }
}));
exports.confirmEmail = confirmEmail;
const loginCustomer = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError_1.ApiError(400, "All fields are required");
    }
    const customer = yield customer_model_1.Customer.findOne({ email: email === null || email === void 0 ? void 0 : email.toLowerCase() });
    if (!customer) {
        throw new ApiError_1.ApiError(404, "Customer not found");
    }
    const isPasswordCorrect = yield customer.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError_1.ApiError(401, "Invalid credentials");
    }
    const { accessToken, refreshToken } = yield generateAccessAndRefreshToken(customer._id);
    const loggedInCustomer = yield customer_model_1.Customer.findById(customer._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse_1.ApiResponse(200, { customer: loggedInCustomer, accessToken, refreshToken }, "Customer logged in successfully"));
}));
exports.loginCustomer = loginCustomer;
const logoutCustomer = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield customer_model_1.Customer.findByIdAndUpdate(req.body._id, {
        $set: {
            refreshToken: undefined,
        },
    }, { new: true });
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };
    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Customer logged out successfully"));
}));
exports.logoutCustomer = logoutCustomer;
const refreshToken = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError_1.ApiError(401, "Refresh token is required");
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.JWT_SECRET);
        const customer = yield customer_model_1.Customer.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id);
        if (!customer || (customer === null || customer === void 0 ? void 0 : customer.refreshToken) !== incomingRefreshToken) {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };
        const { accessToken, refreshToken: newRefreshToken } = yield generateAccessAndRefreshToken(customer._id);
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse_1.ApiResponse(200, { accessToken, newRefreshToken }, "Token refreshed successfully"));
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Something went wrong while refreshing token");
    }
}));
exports.refreshToken = refreshToken;
