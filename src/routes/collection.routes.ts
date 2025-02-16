import { Router } from "express";
import {
    getAllBookCollections,
    getBookCollection,
    createBookCollection,
    updateBookCollection,
    deleteBookCollection,
} from "../controllers/collection.controller";
import { authenticateEmployee } from "../middlewares/authorization.middleware";

const router = Router();

router.route("/").get(getAllBookCollections);
router.route("/:id").get(getBookCollection);
router.route("/create").post(authenticateEmployee, createBookCollection);
router.route("/update/:id").put(authenticateEmployee, updateBookCollection);
router.route("/delete/:id").delete(authenticateEmployee, deleteBookCollection);

export default router;
