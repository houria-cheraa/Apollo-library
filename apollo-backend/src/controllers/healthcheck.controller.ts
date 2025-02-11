import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const healthcheck = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(new ApiResponse(200, "OK", "Health check passed"));
});

export { healthcheck };
