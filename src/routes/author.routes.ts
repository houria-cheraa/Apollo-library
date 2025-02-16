import { Router } from "express";
import {
    getAllAuthors,
    getAuthor,
    createAuthor,
    updateAuthor,
    deleteAuthor,
} from "../controllers/author.controller";
import { authenticateEmployee } from "../middlewares/authorization.middleware";

const router = Router();

router.route("/").get(getAllAuthors);
router.route("/:id").get(getAuthor);
router.route("/create").post(authenticateEmployee, createAuthor);
router.route("/update/:id").put(authenticateEmployee, updateAuthor);
router.route("/delete/:id").delete(authenticateEmployee, deleteAuthor);

export default router;
