import { Router } from "express";
import {
    createOrder
} from "../controllers/order.controller";

const router = Router();

router.post("/create", async (req, res, next) => {
    try {
        await createOrder(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
