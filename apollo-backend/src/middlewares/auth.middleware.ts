import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.model";
import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";

export const verifyJWT = asyncHandler(
    async (req: Request, _res: Response, next) => {
        const token =
            req.cookies.accessToken ||
            req.body.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        try {
            const decodedToken = jwt.verify(
                token,
                process.env.JWT_ACCESS_TOKEN_SECRET as string
            ) as jwt.JwtPayload & { _id: string };

            const customer = await Customer.findById(decodedToken._id).select(
                "-password -refreshToken"
            );

            if (!customer) {
                throw new ApiError(401, "Unauthorized");
            }

            (req as any).customer = customer;

            next();
        } catch (error) {
            throw new ApiError(
                401,
                (error as Error)?.message || "Invalid token"
            );
        }
    }
);
