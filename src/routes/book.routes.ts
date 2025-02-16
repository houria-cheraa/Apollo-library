import { Router } from "express";
import {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
} from "../controllers/book.controller";
import { upload } from "../middlewares/multer.middleware";
import { authenticateEmployee } from "../middlewares/authorization.middleware";

const router = Router();

router.route("/").get(getAllBooks);
router.route("/:id").get(getBook);
router.route("/create").post(authenticateEmployee, upload.single("cover"), createBook);
router.route("/update/:id").put(authenticateEmployee, updateBook);
router.route("/delete/:id").delete(authenticateEmployee, deleteBook);

export default router;
