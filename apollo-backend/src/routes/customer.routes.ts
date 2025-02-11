import { Router } from "express";
import {
    registerCustomer,
    loginCustomer,
    logoutCustomer,
    confirmEmail,
} from "../controllers/customer.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registerCustomer);
router.route("/login").post(loginCustomer);

router.route("/logout").post(verifyJWT, logoutCustomer);
router.route("/confirm-email/:token").get(confirmEmail);

export default router;
