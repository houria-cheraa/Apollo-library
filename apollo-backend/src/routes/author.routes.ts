import { Router } from "express";
import {
    getAllAuthors,
    getAuthor,
    createAuthor,
    updateAuthor,
    deleteAuthor,
} from "../controllers/author.controller";

const router = Router();

router.route("/").get(getAllAuthors);
router.route("/:id").get(getAuthor);
router.route("/create").post(createAuthor);
router.route("/update/:id").put(updateAuthor);
router.route("/delete/:id").delete(deleteAuthor);

export default router;
