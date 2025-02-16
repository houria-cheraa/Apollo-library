import { Router } from "express";
import {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller";
import { authenticateEmployee } from "../middlewares/authorization.middleware";

const router = Router();

router.route("/").get(getAllCategories);
router.route("/:id").get(getCategory);
router.route("/create").post(authenticateEmployee, createCategory);
router.route("/update/:id").put(authenticateEmployee, updateCategory);
router.route("/delete/:id").delete(authenticateEmployee, deleteCategory);

export default router;
