import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { Employee } from "../models/employee.model";

const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.user || !req.body.user.isAdmin) {
        throw new ApiError(403, "Access denied. Admins only.");
    }
    next();
};

const authenticateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Access denied. No token provided.");
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        const employee = await Employee.findById(decoded.id);

        if (!employee) {
            throw new ApiError(401, "Invalid token. Employee not found.");
        }

        req.body.user = employee;
        next();
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token.");
    }
};

export { authenticateAdmin, authenticateEmployee };