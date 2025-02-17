"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const author_controller_1 = require("../controllers/author.controller");
const router = (0, express_1.Router)();
router.route("/").get(author_controller_1.getAllAuthors);
router.route("/:id").get(author_controller_1.getAuthor);
router.route("/create").post(author_controller_1.createAuthor);
router.route("/update/:id").put(author_controller_1.updateAuthor);
router.route("/delete/:id").delete(author_controller_1.deleteAuthor);
exports.default = router;
