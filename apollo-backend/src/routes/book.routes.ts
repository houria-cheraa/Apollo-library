import { Router } from "express";
import {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
} from "../controllers/book.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/").get(getAllBooks);
router.route("/:id").get(getBook);
router.route("/create").post(upload.single("cover"), createBook);
router.route("/update/:id").put(updateBook);
router.route("/delete/:id").delete(deleteBook);

export default router;
