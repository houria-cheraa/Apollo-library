import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Employee } from "../models/employee.model";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcrypt";

const getEmployee = asyncHandler(async (req: Request, res: Response) => {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    res.json(new ApiResponse(200, { employee }));
});

const getEmployees = asyncHandler(async (req: Request, res: Response) => {
    const employees = await Employee.find();
    res.json(new ApiResponse(200, { employees }));
});

const generateAccessAndRefreshToken = async (employeeId: any) => {
    try {
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            throw new ApiError(404, "Employee not found");
        }

        const accessToken = (employee as any).generateAccessToken();
        const refreshToken = (employee as any).generateRefreshToken();

        employee.refreshToken = refreshToken;
        await employee.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerEmployee = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, role } = req.body;

    if ([firstName, lastName, email, password, role].some(field => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
        throw new ApiError(409, "Email already exists");
    }

    const employee = await Employee.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
        role,
    });

    res.status(201).json(new ApiResponse(201, { employee }, "Employee registered successfully"));
});

const loginEmployee = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, employee.password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(employee._id);
    res.json(new ApiResponse(200, { accessToken, refreshToken, employee }, "Login successful"));
});

const logoutEmployee = asyncHandler(async (req: Request, res: Response) => {
    await Employee.findByIdAndUpdate(
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

export { registerEmployee, loginEmployee, logoutEmployee, getEmployee, getEmployees };