import { Router } from "express";
import {
    getAllBookCollections,
    getBookCollection,
    createBookCollection,
    updateBookCollection,
    deleteBookCollection,
} from "../controllers/collection.controller";

const router = Router();

router.route("/").get(getAllBookCollections);
router.route("/:id").get(getBookCollection);
router.route("/create").post(createBookCollection);
router.route("/update/:id").put(updateBookCollection);
router.route("/delete/:id").delete(deleteBookCollection);

export default router;
