import express from "express";
import { registerEmployee, loginEmployee, logoutEmployee, getEmployee, getEmployees } from "../controllers/employee.controller";
import { authenticateEmployee, authenticateAdmin } from "../middlewares/authorization.middleware";
import { verifyJWTEmployee } from "../middlewares/auth.middleware";

const router = express.Router();


router.route("/login").post(loginEmployee);

router.route("/logout").post(verifyJWTEmployee, authenticateEmployee, logoutEmployee);

router.route("/register").post(verifyJWTEmployee, authenticateAdmin, registerEmployee);
router.route("/").get(verifyJWTEmployee, authenticateAdmin, getEmployees);
router.route("/:id").get(verifyJWTEmployee, authenticateAdmin, getEmployee);

export default router;
