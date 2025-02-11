import { Router } from "express";
import {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller";

const router = Router();

router.route("/").get(getAllCategories);
router.route("/:id").get(getCategory);
router.route("/create").post(createCategory);
router.route("/update/:id").put(updateCategory);
router.route("/delete/:id").delete(deleteCategory);

export default router;
